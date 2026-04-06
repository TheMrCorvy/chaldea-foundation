export const dynamicPageFields = [
    "slug",
    "title",
    "description",
    "metadata",
    "background_music",
];

export const populateProjectsSection = {
    "sections.projects-section": {
        populate: {
            link_to_page: {
                populate: "*",
            },
            projects: {
                populate: {
                    body: {
                        populate: {
                            chips: {
                                populate: {
                                    icon: {
                                        populate: "*",
                                    },
                                },
                            },
                        },
                    },
                    links: {
                        populate: {
                            icon: {
                                populate: "*",
                            },
                        },
                    },
                    icon: {
                        populate: "*",
                    },
                },
            },
        },
    },
};

export const populateLandingHeroSection = {
    "sections.landing-hero-section": {
        populate: "*",
    },
};

export const populateWorkExperienceSection = {
    "sections.work-experience-section": {
        populate: {
            link_to_page: {
                populate: "*",
            },
            experience_list_items: {
                populate: "*",
            },
        },
    },
};

export const populateBlogText = {
    "blog.blog-text": {
        populate: "*",
    },
};

export const populateContactSection = {
    "sections.contact-section": {
        populate: {
            contact_form: {
                populate: {
                    inputs: {
                        populate: "*",
                    },
                },
            },
            link_to_page: {
                populate: "*",
            },
        },
    },
};

export const populateDescriptionWithChipsList = {
    "layout.description-with-chips-list": {
        populate: {
            chips: {
                populate: {
                    icon: {
                        populate: "*",
                    },
                },
            },
        },
    },
};

export const populateBlogHero = {
    "blog.blog-hero": {
        populate: {
            link_to_page: {
                populate: "*",
            },
        },
    },
};

export const populatePdfFile = {
    "blog.pdf-file": {
        populate: {
            icon: {
                populate: "*",
            },
        },
    },
};

export const populateLink = {
    "layout.link": {
        populate: {
            icon: {
                populate: "*",
            },
        },
    },
};

export const populateIcon = {
    "layout.icon": {
        populate: "*",
    },
};

export const populateForm = {
    "layout.form": {
        populate: {
            inputs: {
                populate: {
                    option: {
                        populate: "*",
                    },
                    start_icon: {
                        populate: "*",
                    },
                    end_icon: {
                        populate: "*",
                    },
                },
            },
        },
    },
};

export const mainLandingPage = {
    ...populateBlogHero,
    ...populateBlogText,
    ...populateContactSection,
    ...populateWorkExperienceSection,
    ...populateProjectsSection,
    ...populateLandingHeroSection,
    ...populateDescriptionWithChipsList,
};

export const dynamicZone = {
    ...populateBlogHero,
    ...populateBlogText,
    ...populateContactSection,
    ...populateWorkExperienceSection,
    ...populateProjectsSection,
    ...populateLandingHeroSection,
    ...populateDescriptionWithChipsList,
    ...populatePdfFile,
    ...populateLink,
    ...populateIcon,
    ...populateForm,
};
