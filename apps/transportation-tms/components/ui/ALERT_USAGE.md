# Alert System Usage Guide

The alert system provides a customizable, reusable notification system for the entire application.

## Features

- ✅ 4 alert types: Success, Error, Warning, Info
- ✅ Customizable duration (auto-dismiss)
- ✅ Dismissible alerts with close button
- ✅ Multiple alert positions (top-right, top-left, top-center, bottom-right, bottom-left, bottom-center)
- ✅ Smooth animations
- ✅ Accessible (ARIA labels)
- ✅ Type-safe with TypeScript

## Basic Usage

### 1. Import the hook

```tsx
import { useAlert } from "@/components/ui/alert-provider";
```

### 2. Use in your component

```tsx
"use client";

import { useAlert } from "@/components/ui/alert-provider";

export function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useAlert();

  const handleAction = async () => {
    try {
      // Your action here
      showSuccess("Operation completed successfully!");
    } catch (error) {
      showError("Something went wrong!");
    }
  };

  return (
    <button onClick={handleAction}>
      Do Something
    </button>
  );
}
```

## Alert Methods

### Quick Methods (Recommended)

```tsx
const { showSuccess, showError, showWarning, showInfo } = useAlert();

// Success alert (default 5 seconds)
showSuccess("User created successfully!");

// Error alert (default 7 seconds - stays longer)
showError("Failed to save changes");

// Warning alert (default 5 seconds)
showWarning("Please review your input");

// Info alert (default 5 seconds)
showInfo("New features available");
```

### With Title

```tsx
showSuccess("User created successfully!", "Success");
showError("Failed to save changes", "Error");
showWarning("Please review your input", "Warning");
showInfo("New features available", "Information");
```

### With Custom Duration

```tsx
// Show for 10 seconds
showSuccess("Saved!", "Success", 10000);

// Show permanently (until manually dismissed)
showError("Critical error!", "Error", 0);
```

### Advanced Usage

```tsx
const { showAlert } = useAlert();

// Full control
showAlert("error", "Something went wrong", {
  title: "Error",
  duration: 7000, // 7 seconds
  dismissible: true, // Can be closed manually
});
```

## Examples

### Form Submission

```tsx
async function handleSubmit(formData: FormData) {
  try {
    const result = await createItem(formData);
    if (result.success) {
      showSuccess("Item created successfully!");
      formRef.current?.reset();
    } else {
      showError(result.error || "Failed to create item");
    }
  } catch (error) {
    showError("An unexpected error occurred");
  }
}
```

### API Error Handling

```tsx
try {
  const response = await fetch("/api/data");
  if (!response.ok) {
    showError(`Request failed: ${response.statusText}`, "API Error");
    return;
  }
  const data = await response.json();
  showSuccess("Data loaded successfully!");
} catch (error) {
  showError("Network error. Please check your connection.");
}
```

### Confirmation Messages

```tsx
const handleDelete = async (id: string) => {
  if (confirm("Are you sure?")) {
    try {
      await deleteItem(id);
      showSuccess("Item deleted successfully");
    } catch (error) {
      showError("Failed to delete item");
    }
  }
};
```

### Validation Messages

```tsx
const validateForm = () => {
  if (!email) {
    showWarning("Email is required", "Validation");
    return false;
  }
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address", "Validation");
    return false;
  }
  return true;
};
```

## Alert Types

| Type | Color | Default Duration | Use Case |
|------|-------|------------------|----------|
| `success` | Green | 5 seconds | Successful operations |
| `error` | Red | 7 seconds | Errors and failures |
| `warning` | Yellow | 5 seconds | Warnings and cautions |
| `info` | Blue | 5 seconds | Informational messages |

## Customization

### Change Alert Position

Edit `components/ui/alert-container.tsx`:

```tsx
// Change default position
position = "top-left" // or "bottom-center", etc.
```

### Change Default Duration

Edit `components/ui/alert-provider.tsx`:

```tsx
// Change default duration for errors
showAlert("error", message, { duration: 10000 }); // 10 seconds
```

## Best Practices

1. **Use appropriate alert types**:
   - Success for completed actions
   - Error for failures
   - Warning for important notices
   - Info for general information

2. **Keep messages concise**: Alerts should be brief and clear

3. **Use titles for important alerts**: Titles help users quickly understand the context

4. **Don't overuse alerts**: Too many alerts can be overwhelming

5. **Error alerts stay longer**: Errors default to 7 seconds to ensure users see them

## Accessibility

- Alerts use proper ARIA attributes (`role="alert"`, `aria-live="polite"`)
- Close buttons have `aria-label` for screen readers
- Color is not the only indicator (icons are also used)

## Notes

- The AlertProvider is already set up in `app/layout.tsx`
- Alerts appear in the top-right corner by default
- Multiple alerts stack vertically
- Alerts automatically dismiss after their duration
- Users can manually dismiss alerts with the X button




