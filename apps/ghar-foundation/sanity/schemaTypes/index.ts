import { type SchemaTypeDefinition } from 'sanity';
import { project } from './project';
import { news } from './news';
import { teamMember } from './teamMember';
import { partner } from './partner';
import { heroSlide } from './heroSlide';
import { stat } from './stat';
import { siteSettings } from './siteSettings';
import { aboutContent } from './aboutContent';
import { job } from './job';
import { transparencyContent } from './transparencyContent';
import { privacyContent } from './privacyContent';
import { homeContent } from './homeContent';
import { projectsPage } from './projectsPage';
import { newsPage } from './newsPage';
import { jobsPage } from './jobsPage';
import { volunteerPage } from './volunteerPage';
import { donatePage } from './donatePage';
import { contactPage } from './contactPage';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    project, news, teamMember, partner, heroSlide, stat,
    siteSettings, aboutContent, job, transparencyContent,
    privacyContent, homeContent, projectsPage, newsPage,
    jobsPage, volunteerPage, donatePage, contactPage,
  ],
};