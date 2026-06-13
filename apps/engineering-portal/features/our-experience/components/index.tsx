import OurExperienceClient from './our-experience';
import { getExperienceCardsData } from '@/features/our-experience/queries';

export default async function OurExperience() {
  const experienceCardsData = await getExperienceCardsData();

  return <OurExperienceClient experienceCardsData={experienceCardsData} />;
}
