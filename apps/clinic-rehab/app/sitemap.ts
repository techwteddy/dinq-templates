import { MetadataRoute } from 'next';
import { newsData } from '@/app/data/news';
import { newsDataEn } from '@/app/data/newsEn';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vitrylazhyttia.com.ua';
  const currentDate = new Date();

  // Динамічні посилання для кожної УКРАЇНСЬКОЇ новини з англійськими альтернативами
  const ukrNewsUrls = newsData.map((news) => ({
    url: `${baseUrl}/novyny/${news.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    languages: {
      'uk-UA': `${baseUrl}/novyny/${news.slug}`,
      'en-US': `${baseUrl}/en/news/${news.slug}`,
    },
  }));

  // Динамічні посилання для кожної АНГЛІЙСЬКОЇ новини з українськими альтернативами
  const engNewsUrls = newsDataEn.map((news) => ({
    url: `${baseUrl}/en/news/${news.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    languages: {
      'uk-UA': `${baseUrl}/novyny/${news.slug}`,
      'en-US': `${baseUrl}/en/news/${news.slug}`,
    },
  }));

  const staticPages = [
    // ГОЛОВНА
    { 
      url: baseUrl, 
      lastModified: currentDate, 
      changeFrequency: 'weekly' as const, 
      priority: 1.0,
      languages: { 'uk-UA': baseUrl, 'en-US': `${baseUrl}/en` }
    },
    { 
      url: `${baseUrl}/en`, 
      lastModified: currentDate, 
      changeFrequency: 'weekly' as const, 
      priority: 1.0,
      languages: { 'uk-UA': baseUrl, 'en-US': `${baseUrl}/en` }
    },

    // ПРО НАС
    { 
      url: `${baseUrl}/pro-nas`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/pro-nas`, 'en-US': `${baseUrl}/en/about-us` }
    },
    { 
      url: `${baseUrl}/en/about-us`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/pro-nas`, 'en-US': `${baseUrl}/en/about-us` }
    },

    // НАПРЯМКИ
    { 
      url: `${baseUrl}/napryamky`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/napryamky`, 'en-US': `${baseUrl}/en/directions` }
    },
    { 
      url: `${baseUrl}/en/directions`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/napryamky`, 'en-US': `${baseUrl}/en/directions` }
    },

    // КОМАНДА
    { 
      url: `${baseUrl}/komanda`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/komanda`, 'en-US': `${baseUrl}/en/team` }
    },
    { 
      url: `${baseUrl}/en/team`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/komanda`, 'en-US': `${baseUrl}/en/team` }
    },

    // НОВИНИ (Список)
    { 
      url: `${baseUrl}/novyny`, 
      lastModified: currentDate, 
      changeFrequency: 'weekly' as const, 
      priority: 0.9,
      languages: { 'uk-UA': `${baseUrl}/novyny`, 'en-US': `${baseUrl}/en/news` }
    },
    { 
      url: `${baseUrl}/en/news`, 
      lastModified: currentDate, 
      changeFrequency: 'weekly' as const, 
      priority: 0.9,
      languages: { 'uk-UA': `${baseUrl}/novyny`, 'en-US': `${baseUrl}/en/news` }
    },

    // КОНТАКТИ
    { 
      url: `${baseUrl}/kontakty`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/kontakty`, 'en-US': `${baseUrl}/en/contacts` }
    },
    { 
      url: `${baseUrl}/en/contacts`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/kontakty`, 'en-US': `${baseUrl}/en/contacts` }
    },

    // ВАКАНСІЇ
    { 
      url: `${baseUrl}/vakansiyi`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/vakansiyi`, 'en-US': `${baseUrl}/en/vacancy` }
    },
    { 
      url: `${baseUrl}/en/vacancy`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.8,
      languages: { 'uk-UA': `${baseUrl}/vakansiyi`, 'en-US': `${baseUrl}/en/vacancy` }
    },

    // ДЛЯ ПАЦІЄНТА - ДОКУМЕНТИ
    { 
      url: `${baseUrl}/dlya-patsiyenta/dokumenty`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7,
      languages: { 'uk-UA': `${baseUrl}/dlya-patsiyenta/dokumenty`, 'en-US': `${baseUrl}/en/for-patient/documents` }
    },
    { 
      url: `${baseUrl}/en/for-patient/documents`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7,
      languages: { 'uk-UA': `${baseUrl}/dlya-patsiyenta/dokumenty`, 'en-US': `${baseUrl}/en/for-patient/documents` }
    },

    // ДЛЯ ПАЦІЄНТА - РЕАБІЛІТАЦІЯ
    { 
      url: `${baseUrl}/dlya-patsiyenta/reabilitatsiya`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7,
      languages: { 'uk-UA': `${baseUrl}/dlya-patsiyenta/reabilitatsiya`, 'en-US': `${baseUrl}/en/for-patient/rehabilitation` }
    },
    { 
      url: `${baseUrl}/en/for-patient/rehabilitation`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7,
      languages: { 'uk-UA': `${baseUrl}/dlya-patsiyenta/reabilitatsiya`, 'en-US': `${baseUrl}/en/for-patient/rehabilitation` }
    },

    // ДЛЯ ПАЦІЄНТА - ПЛАТНІ ПОСЛУГИ
    { 
      url: `${baseUrl}/dlya-patsiyenta/platni-poslugy`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7,
      languages: { 'uk-UA': `${baseUrl}/dlya-patsiyenta/platni-poslugy`, 'en-US': `${baseUrl}/en/for-patient/paid-services` }
    },
    { 
      url: `${baseUrl}/en/for-patient/paid-services`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7,
      languages: { 'uk-UA': `${baseUrl}/dlya-patsiyenta/platni-poslugy`, 'en-US': `${baseUrl}/en/for-patient/paid-services` }
    },
  ];

  return [...staticPages, ...ukrNewsUrls, ...engNewsUrls];
}