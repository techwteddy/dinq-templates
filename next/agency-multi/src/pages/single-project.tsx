import useFramerTransition from "@/hooks/use-transition";
import SectionQuotation from "@/components/sections/section-quotation";
import PostData from "@/data/projects.json";
import { Helmet } from "react-helmet";

const post = PostData[0];
const featuredMedia = PostData[0].featuredmedia;
const featuredImageSizes = featuredMedia?.["media_details"];

const SingleProject = useFramerTransition(
  <>
    <Helmet>
      <title>Single Project</title>
    </Helmet>
    <main className="relative mt-[4.5rem] lg:mt-[161px]">
      <div className="relative flex h-96 flex-col items-center justify-center px-4 py-16 before:absolute before:inset-0 before:z-[1] before:bg-foreground/75 lg:h-[30rem]">
        {featuredMedia && featuredImageSizes && (
          <img
            src={featuredImageSizes?.["source_url"]}
            alt={featuredMedia.alt_text}
            className="absolute inset-0 mb-6 h-full w-full object-cover"
          />
        )}
        <div className="relative z-[1] mx-auto max-w-4xl text-center">
          <h1
            className="mb-5 text-white lg:text-5xl"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          ></h1>
        </div>
      </div>

      {(post?.acf?.project_feature_1_number ||
        post?.acf?.project_feature_1_text ||
        post?.acf?.project_feature_2_number ||
        post?.acf?.project_feature_2_text ||
        post?.acf?.project_feature_3_number ||
        post?.acf?.project_feature_3_text) && (
        <div className="relative z-[1] -m-20 mx-auto mb-5 flex max-w-[50rem] flex-wrap items-center space-y-5 lg:flex-nowrap lg:space-x-10 lg:space-y-0">
          {post?.acf?.project_feature_1_number ||
          post?.acf?.project_feature_1_text ? (
            <div className="w-full rounded bg-white p-12 shadow-sm dark:bg-slate-800 dark:shadow-slate-950/20 lg:flex-1">
              {post?.acf?.project_feature_1_number && (
                <span className="mb-4 block text-2xl font-bold text-green lg:text-[2.25rem]">
                  {post?.acf?.project_feature_1_number}
                </span>
              )}
              {post?.acf?.project_feature_1_text && (
                <span className="text-[1.0625rem] font-bold text-foreground dark:text-slate-400">
                  {post?.acf?.project_feature_1_text}
                </span>
              )}
            </div>
          ) : null}

          {post?.acf?.project_feature_2_number ||
          post?.acf?.project_feature_2_text ? (
            <div className="w-full rounded bg-white p-12 shadow-sm dark:bg-slate-800 dark:shadow-slate-950/20 lg:flex-1">
              {post?.acf?.project_feature_2_number && (
                <span className="mb-4 block text-2xl font-bold text-green lg:text-[2.25rem]">
                  {post?.acf?.project_feature_2_number}
                </span>
              )}
              {post?.acf?.project_feature_2_text && (
                <span className="text-[1.0625rem] font-bold text-foreground dark:text-slate-400">
                  {post?.acf?.project_feature_2_text}
                </span>
              )}
            </div>
          ) : null}

          {post?.acf?.project_feature_3_number ||
          post?.acf?.project_feature_3_text ? (
            <div className="w-full rounded bg-white p-12 shadow-sm dark:bg-slate-800 dark:shadow-slate-950/20 lg:flex-1">
              {post?.acf?.project_feature_3_number && (
                <span className="mb-4 block text-2xl font-bold text-green lg:text-[2.25rem]">
                  {post?.acf?.project_feature_3_number}
                </span>
              )}
              {post?.acf?.project_feature_3_text && (
                <span className="text-[1.0625rem] font-bold text-foreground dark:text-slate-400">
                  {post?.acf?.project_feature_3_text}
                </span>
              )}
            </div>
          ) : null}
        </div>
      )}

      <section className="pb-24 pt-16">
        <div className="container">
          <article
            className="prose prose-lg mx-auto max-w-[50rem] dark:prose-invert prose-headings:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          ></article>
        </div>
      </section>
      <SectionQuotation />
    </main>
  </>,
);

export default SingleProject;
