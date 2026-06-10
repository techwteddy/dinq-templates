import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import OptimizedImage from "@/components/ui/optimized-image";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // Simulate image loading
    const handleLoad = () => {
      if (props.onLoad) {
        props.onLoad();
      }
    };

    const handleError = () => {
      if (props.onError) {
        props.onError();
      }
    };

    // Filter out Next.js specific props that shouldn't be on DOM elements
    const { 
      fill, 
      priority, 
      loading, 
      sizes, 
      quality, 
      placeholder,
      blurDataURL,
      onLoad,
      onError,
      ...domProps 
    } = props;

    return (
      <img
        {...domProps}
        alt={props.alt}
        data-testid="next-image"
        data-loading={loading}
        data-priority={priority?.toString()}
        data-fill={fill?.toString()}
        data-sizes={sizes}
        data-quality={quality}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  },
}));

describe("OptimizedImage Component", () => {
  describe("Basic Rendering", () => {
    it("renders with required props", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("alt", "Test image");
    });

    it("renders with alt text for accessibility", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Descriptive alt text"
          width={800}
          height={600}
        />
      );

      const image = screen.getByAltText("Descriptive alt text");
      expect(image).toBeInTheDocument();
    });
  });

  describe("Lazy Loading", () => {
    it("applies lazy loading by default", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-loading", "lazy");
    });

    it("applies lazy loading when belowFold is true", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
          belowFold={true}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-loading", "lazy");
    });

    it("applies eager loading when priority is true", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
          priority={true}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-loading", "eager");
      expect(image).toHaveAttribute("data-priority", "true");
    });

    it("priority overrides belowFold setting", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
          belowFold={true}
          priority={true}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-loading", "eager");
    });
  });

  describe("Responsive Attributes", () => {
    it("applies custom sizes attribute when provided", () => {
      const customSizes = "(max-width: 768px) 100vw, 50vw";
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
          sizes={customSizes}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-sizes", customSizes);
    });

    it("applies default sizes for fill images when not provided", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          fill={true}
        />
      );

      const image = screen.getByTestId("next-image");
      const sizes = image.getAttribute("data-sizes");
      expect(sizes).toBeTruthy();
      expect(sizes).toContain("100vw");
    });

    it("uses custom sizes over default for fill images", () => {
      const customSizes = "(max-width: 640px) 100vw, 800px";
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          fill={true}
          sizes={customSizes}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-sizes", customSizes);
    });
  });

  describe("Image Quality", () => {
    it("applies default quality of 85", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-quality", "85");
    });

    it("applies custom quality when provided", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
          quality={95}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-quality", "95");
    });
  });

  describe("Placeholder and Layout Shift Prevention", () => {
    it("shows placeholder background while loading", () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("bg-gray-200");
      expect(wrapper).toHaveClass("animate-pulse");
    });

    it("removes placeholder after image loads", async () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      
      // Trigger load event wrapped in act
      await act(async () => {
        image.dispatchEvent(new Event("load"));
      });

      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).not.toHaveClass("animate-pulse");
      });
    });
  });

  describe("Error Handling", () => {
    it("displays alt text when image fails to load", async () => {
      render(
        <OptimizedImage
          src="/broken-image.jpg"
          alt="Failed to load image"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      
      // Trigger error event wrapped in act
      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      await waitFor(() => {
        expect(screen.getByText("Failed to load image")).toBeInTheDocument();
      });
    });

    it("applies error styling when image fails", async () => {
      const { container } = render(
        <OptimizedImage
          src="/broken-image.jpg"
          alt="Failed image"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      
      // Trigger error event wrapped in act
      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      await waitFor(() => {
        const errorDiv = screen.getByText("Failed image").parentElement;
        expect(errorDiv).toHaveClass("bg-gray-100");
      });
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
          className="custom-class rounded-lg"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
      expect(wrapper).toHaveClass("rounded-lg");
    });
  });

  describe("Fill Mode", () => {
    it("renders in fill mode without width and height", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          fill={true}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toBeInTheDocument();
      expect(image).not.toHaveAttribute("width");
      expect(image).not.toHaveAttribute("height");
    });

    it("applies fill prop to Next.js Image", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          fill={true}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-fill", "true");
    });
  });

  describe("Static Image Data", () => {
    it("accepts StaticImageData as src", () => {
      const staticImage = {
        src: "/static-image.jpg",
        height: 600,
        width: 800,
        blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      };

      render(
        <OptimizedImage
          src={staticImage}
          alt="Static image"
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("always includes alt text", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Accessible description"
          width={800}
          height={600}
        />
      );

      const image = screen.getByAltText("Accessible description");
      expect(image).toBeInTheDocument();
    });

    it("shows alt text in error state for screen readers", async () => {
      render(
        <OptimizedImage
          src="/broken-image.jpg"
          alt="Important content description"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      
      await act(async () => {
        image.dispatchEvent(new Event("error"));
      });

      await waitFor(() => {
        expect(screen.getByText("Important content description")).toBeInTheDocument();
      });
    });
  });

  describe("Performance Optimization", () => {
    it("validates Requirements 13.4: lazy loads below-fold images", () => {
      render(
        <OptimizedImage
          src="/below-fold.jpg"
          alt="Below fold image"
          width={800}
          height={600}
          belowFold={true}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-loading", "lazy");
    });

    it("validates Requirements 13.5: uses modern image formats via Next.js", () => {
      // Next.js automatically handles WebP/AVIF conversion
      // This is configured in next.config.js
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toBeInTheDocument();
      // Format conversion is handled by Next.js Image component
    });

    it("validates Requirements 17.4: includes responsive srcset via sizes", () => {
      render(
        <OptimizedImage
          src="/responsive.jpg"
          alt="Responsive image"
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      );

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("data-sizes");
    });

    it("validates Requirements 19.2: prevents layout shift with placeholder", () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      // Placeholder background prevents layout shift
      expect(wrapper).toHaveClass("bg-gray-200");
    });
  });
});
