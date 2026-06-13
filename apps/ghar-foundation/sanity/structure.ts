import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('GHAR Organization')
    .items([

      // ─── PAGES ───────────────────────────────────────────
      S.listItem()
        .title('Pages')
        .icon(() => '📄')
        .child(
          S.list()
            .id('pages')
            .title('Pages')
            .items([

              // Home
              S.listItem()
                .title('Home')
                .icon(() => '🏠')
                .child(
                  S.list()
                    .id('home')
                    .title('Home')
                    .items([
                      S.documentTypeListItem('heroSlide').title('Hero Slides'),
                      S.documentTypeListItem('stat').title('Statistics'),
                      S.listItem()
                        .id('homeContent')
                        .title('Quote')
                        .icon(() => '💬')
                        .child(
                          S.document()
                            .schemaType('homeContent')
                            .documentId('homeContent')
                        ),
                    ])
                ),

              // About
              S.listItem()
                .title('About')
                .icon(() => '🏢')
                .child(
                  S.list()
                    .id('about')
                    .title('About')
                    .items([
                      S.listItem()
                        .id('aboutContent')
                        .title('About Content')
                        .icon(() => 'ℹ️')
                        .child(
                          S.document()
                            .schemaType('aboutContent')
                            .documentId('aboutContent')
                        ),
                      S.documentTypeListItem('teamMember').title('Team Members'),
                      S.documentTypeListItem('partner').title('Partners'),
                    ])
                ),

              // Projects
              S.listItem()
                .title('Projects')
                .icon(() => '🗂️')
                .child(
                  S.list()
                    .id('projects')
                    .title('Projects')
                    .items([
                      S.listItem()
                        .id('projectsPage')
                        .title('Page Settings')
                        .icon(() => '🖼️')
                        .child(
                          S.document()
                            .schemaType('projectsPage')
                            .documentId('projectsPage')
                        ),
                      S.documentTypeListItem('project').title('Projects List'),
                    ])
                ),

              // News
              S.listItem()
                .title('News')
                .icon(() => '📰')
                .child(
                  S.list()
                    .id('news')
                    .title('News')
                    .items([
                      S.listItem()
                        .id('newsPage')
                        .title('Page Settings')
                        .icon(() => '🖼️')
                        .child(
                          S.document()
                            .schemaType('newsPage')
                            .documentId('newsPage')
                        ),
                      S.documentTypeListItem('news').title('News List'),
                    ])
                ),

              // Jobs
              S.listItem()
                .title('Jobs')
                .icon(() => '💼')
                .child(
                  S.list()
                    .id('jobs')
                    .title('Jobs')
                    .items([
                      S.listItem()
                        .id('jobsPage')
                        .title('Page Settings')
                        .icon(() => '🖼️')
                        .child(
                          S.document()
                            .schemaType('jobsPage')
                            .documentId('jobsPage')
                        ),
                      S.documentTypeListItem('job').title('Jobs List'),
                    ])
                ),

              // Volunteer
              S.listItem()
                .id('volunteer')
                .title('Volunteer')
                .icon(() => '🤝')
                .child(
                  S.document()
                    .schemaType('volunteerPage')
                    .documentId('volunteerPage')
                ),

              // Donate
              S.listItem()
                .id('donate')
                .title('Donate')
                .icon(() => '💳')
                .child(
                  S.document()
                    .schemaType('donatePage')
                    .documentId('donatePage')
                ),

              // Contact
              S.listItem()
                .id('contact')
                .title('Contact')
                .icon(() => '📬')
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                ),

              // Transparency
              S.listItem()
                .id('transparency')
                .title('Transparency')
                .icon(() => '📑')
                .child(
                  S.document()
                    .schemaType('transparencyContent')
                    .documentId('transparencyContent')
                ),

              // Privacy Policy
              S.listItem()
                .id('privacyPolicy')
                .title('Privacy Policy')
                .icon(() => '🔒')
                .child(
                  S.document()
                    .schemaType('privacyContent')
                    .documentId('privacyContent')
                ),
            ])
        ),

      S.divider(),

      // ─── SETTINGS ────────────────────────────────────────
      S.listItem()
        .title('Settings')
        .icon(() => '⚙️')
        .child(
          S.list()
            .id('settings')
            .title('Settings')
            .items([
              S.listItem()
                .id('siteSettings')
                .title('Site Settings')
                .icon(() => '🌐')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
            ])
        ),
    ])