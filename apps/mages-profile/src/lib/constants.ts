export const dynamicPageFields = [
    "slug",
    "title",
    "description",
    "metadata",
    "background_music",
    "use_server",
];

export const populateProjectsSection = {
    "sections.projects-section": {
        populate: {
            link_to_page: {
                populate: {
                    icon: {
                        populate: "*",
                    },
                },
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
                    cover_image: {
                        populate: "*",
                    },
                },
            },
        },
    },
};

export const populateLandingHeroSection = {
    "sections.landing-hero-section": {
        populate: {
            pdf_file: {
                populate: {
                    icon: {
                        populate: "*",
                    },
                    file: {
                        populate: "*",
                    },
                },
            },
            call_to_actions: {
                populate: {
                    icon: {
                        populate: "*",
                    },
                },
            },
            profile_image: {
                populate: "*",
            },
            commands: {
                populate: "*",
            },
        },
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

export const populateBlogImage = {
    "blog.blog-image": {
        populate: {
            image: {
                populate: "*",
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
    ...populateBlogImage,
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
    ...populateBlogImage,
};
