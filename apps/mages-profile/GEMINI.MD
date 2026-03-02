# Project Overview

## Summary

mages-profile is a Next.js 14, React & TypeScript portfolio themed
after the Chaldea Security Organization (Fate/Grand Order). It showcases
developer skills via interactive UI elements inspired by the FGO aesthetic.

## Deep overview

This is a Next.js project named "mages-profile". It's a portfolio website with a creative, "mages" or fantasy-themed design. The main theme of the app is Chaldea, the Humanity Security Organization from the fictional mobile game, manga and anime called Fate/Grand Order. The idea for this portfolio is to re-create the profile or CV of a mage that is working at the Chaldea Foundation. The mage in this case is a fullstack developer with experience in Node.js, TypeScript, and React. The application is split into many sections: a main page that introduces the user with a stylized profile and an interactive globe that recreates Chaldeas observatory from FGO. Then there is the route /cv that contains a server-side rendered page with the cv info of the user. Then there is the /projects page that contains a 2 x 3 grid of SharedLight cards components (one card for each project) that can redirect the user to either the project, or the blog (if available) of that particular project, or the github repository for the project. And lastly there is the /blog/"slug" page where visitors can see the how-to for a specific project. The blog post page is server-side rendered that just has a dynamic component return for each block that comes from strapi.

The app uses React, TypeScript, and Material-UI for the frontend, with D3.js for the interactive globe and Framer Motion for animations.

The app is part of a monorepo built with turborepo and it makes use of different shared components/utils/logic. The monorepo has a custom integration with strapi. This app consumes strapi directly from the code as an sdk that returns data asynchronously. The sdk implementation is wrapped up in a cache component that only refreshes once a week, so that the app doesn't have to send the same request over and over again.

# Monorepo workspace

- Workspace managed with Turborepo
- apps/mages-profile is the Next.js app
- packages/ui, packages/utils, shared SDKs (including Strapi client)
- Path aliases configured via tsconfig.json

# Strapi SDK integration

- SDK located at the root of teh monrepo /packages/platform-service-sdk
- Uses fetch with cache + revalidate strategies
- Cached in local client up to one week

# Project styling overview

- MUI theme defined in src/lib/theme.ts
- Uses custom color palette inspired by FGO UI hues
- Styles in sx prop and CSS modules

This project uses Material UI (MUI) theme, with a custom color palette. The theme declaration is located in `src/lib/theme.ts`. The idea behind the styling is that this project should imitate Chaldea's aesthetic with light blue semi-transparent backgrounds and bright orange for borders to create more similarities with the looks of the Fate/Grand Order franchise.

All the custom styles in a MUI component should be declared in the `sx` prop.

Some other components are using plain .module.css files like for example GlitchButton.

The project also has implemented animations with Framer Motion.

All of this in conjunction creates a look and feel of holograms, that relate to the futuristic stylish looks of the FGO franchise.

# Application Structure

- **`src/app/page.tsx`**: The main landing page of the application. It features the `MagesData` component, which displays the user's profile, and the `Globe` component, an interactive 3D globe. This page is recreating Chaldeas observatory and is where all the user interactivity comes in place. The globe has some countries marked, and when the user clicks on one of them (as well as if they click on the same button for the AsideHelper component) a "hologram" modal shows up displaying information related to the mage/user.
- **`src/app/cv/page.tsx`**: A more traditional CV page that showcases the user's skills, featured projects, and contact information.
- **`src/app/projects/page.tsx`**: A simple minimalistic page that renders a list of the user's side-projects and gives the visitors options to go to see the project, go to the repo on github, or see the behind the scenes for that project in the blog page.
- **`src/app/blog/[slug]/page.tsx`**: A server-side rendered page that request its information to strapi, and then renders the blocks dynamically. It is mainly text and images (the images are hosted in a different domain from this app's).

# Routing and data fetching

| Route | Description | Rendering |
| / | Main landing with interactive globe | Static + CSR |
| /cv | Curriculum overview | SSR/SSG + revalidate |
| /projects | Projects grid | Static |
| /blog/[slug] | Dynamic blog entries from Strapi | Dynamic SSR |

# Key Components

- **`MagesData`**: This component is responsible for displaying the main user profile information, including a profile picture, name, and title in an atempt to recreate the profile of Fujimaru Ritsuka in the game Fate/Grand Order. It uses Framer Motion for animations.
- **`Globe`**: This component renders an interactive 3D globe using D3.js. It allows users to click on countries, which then displays additional information in a modal. It is the recreation of the Chaldeas observatory.
- **`HologramGlitchText`**: A reusable component that applies a "glitch" effect to text. It's used throughout the application to create a stylized, futuristic feel similar to a hologram.
- **`GlitchBackgroundCard`**: This component creates a card with a background that reveals a glitchy, random string of characters on hover. It also features a radial gradient that follows the mouse, creating a spotlight effect. This is similar to the hologram communication method seen in the anime Fate/Apocrypha.
- **`GlitchButton`**: A simple button that gives a feeling of a glitchy hologram effect on hover. It has a selected state where the background color persists, and a corner variant to let the developer decide what side the decorations of the button should point to.
- **`GlitchText`**: This component creates an ilusion of decrypting data. It first generates a random string, and one by one the letters of the original string appear as the time goes on. This animation/effect can be triggered on hover, on initial load, or on both cases.
- **`Loader`**: A simple spinner made with a css animation that has a look similar to a rainbow effect, like its some magecraft that is creating the page.
- **`Modal`**: The modal component is a kind of hologram that positions the content in a grid designed with simple borders from css, and the content lives in the square corresponding to the 3rd column (from left to right) and the middle row (there are 3 rows). This modal is recreating the aesthetics of a hologram.
- **`SharedLightCards`**: A magical card hover effect spanning multiple cards at once. When the user hovers a card, a spotlight is created to follow their cursor, then if the cursor gets too close to the borders the cards that ar next to that border "light up" their own borders as if the light was trascending from one card to another one.
- **`StarryContainer`**: A container component that occupies the entire available space and creates "star" elements that glow with ana nimation created with framer motion. This gives the illution of a starry night.
- **`ToggleSound`**: A simple component that uses GlitchButton, and sets event listeners for user clicks in order to play sounds according to what element the user has clicked. This also controls the background music.
- **`AsideHelper`**: This component creats almost the entire layout of the main page. The AsideHelper implements Framer Motion's animations to give life to the elements inside of it, these being: a text that is using HologramGlitchTextComponent, the ToggleSound component, and a list of the marked countries so that the user has a visible and clear call-to-action.

# Building and Running

To get the project running locally, use the following commands:

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Production Build:** `npm run deploy`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`
- **Storybook:** `npm run storybook`

# Development Conventions

- ESLint + TS strict mode
- Component structure: index.tsx, hooks.ts, styles.module.css, tests, storybook.
- Naming conventions and alias paths

The project uses ESLint for code linting, and the configuration is in `eslint.config.mjs`. The project is configured to use TypeScript with strict mode enabled. The `tsconfig.json` file defines path aliases, with `@/*` pointing to `src/*`. The components are stored in `/[component name]/index.tsx` with their logic in a custom hook in the same folder, their styles in another custom hook or css module in their same folder and unit test in the same folder with the name `[component name].test.tsx`

# Preferences

Do not use type "any". Make sure ther are no errors or warnings thrown in the code by eslint by running `npm run lint`. Make sure the app builds fine after finishing any change by running `npm run build`. Do not remove any file unless it is completely unused throughout the project. Do not install dependencies unless the users asks to. Do not run `npm install` unless there has been a change in the package.json file's dependencies.
