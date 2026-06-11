import { Link } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/20/solid";

type Props = {
  project: Post;
};

const ProjectCard = ({ project }: Props) => {
  const featuredMedia = project.featuredmedia;
  const featuredImageSizes = featuredMedia?.["media_details"];
  const categories = project?.categories;

  return (
    <article className="hover-shadow overflow-hidden rounded-lg hover:top-0">
      <figure className="relative overflow-hidden">
        {categories && (
          <div className="absolute left-0 top-0 z-[1] flex space-x-1.5 p-8 text-xs font-medium">
            {categories.map((category) => <span className="rounded bg-slate-850/80 px-3 py-1 text-white" key={category.id}>
              {category.name}
              </span>
            )}
          </div>
        )}
        <Link
          to={`/single-project`}
          className="group after:absolute after:inset-0 after:bg-gradient-to-t after:from-slate-950/75 after:via-transparent after:via-50%"
        >
          {featuredMedia && featuredImageSizes && (
            <>
              <img
                src={featuredImageSizes?.["source_url"]}
                alt={featuredMedia.alt_text}
                width={featuredImageSizes.width}
                height={featuredImageSizes.height}
                className="transition-transform duration-1600 will-change-transform group-hover:scale-105"
              />
            </>
          )}
        </Link>
        <h2 className="absolute bottom-0 mb-0 px-8 py-6 text-xl font-bold text-white hover:text-primary">
          <Link
            to={`/single-project`}
            dangerouslySetInnerHTML={{ __html: project?.title?.rendered }}
          />
        </h2>
      </figure>
      <div className="rounded-b-lg bg-white p-10 dark:bg-slate-800">
        {(project?.acf?.project_feature_1_number ||
          project?.acf?.project_feature_1_text ||
          project?.acf?.project_feature_2_number ||
          project?.acf?.project_feature_2_text) && (
          <div className="mb-5 flex flex-wrap items-center lg:flex-nowrap">
            <div className="w-full p-3 text-center lg:flex-1 lg:border-r">
              {project?.acf?.project_feature_1_number && (
                <span className="text-green block text-2xl font-bold lg:text-[2.25rem]">
                  {project?.acf?.project_feature_1_number}
                </span>
              )}
              {project?.acf?.project_feature_1_text && (
                <span className="text-[1.0625rem] font-bold">
                  {project?.acf?.project_feature_1_text}
                </span>
              )}
            </div>
            <div className="w-full p-3 text-center lg:flex-1">
              {project?.acf?.project_feature_2_number && (
                <span className="text-green block text-2xl font-bold lg:text-[2.25rem]">
                  {project?.acf?.project_feature_2_number}
                </span>
              )}
              {project?.acf?.project_feature_2_text && (
                <span className="text-[1.0625rem] font-bold">
                  {project?.acf?.project_feature_2_text}
                </span>
              )}
            </div>
          </div>
        )}

        {project?.excerpt?.rendered && (
          <div
            dangerouslySetInnerHTML={{ __html: project?.excerpt?.rendered }}
          ></div>
        )}
        <a
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex items-center text-sm font-bold text-secondary hover:text-primary"
        >
          View Case Study
          <ChevronRightIcon width={20} height={20} className="ml-4" />
        </a>
      </div>
    </article>
  );
};

export default ProjectCard;
