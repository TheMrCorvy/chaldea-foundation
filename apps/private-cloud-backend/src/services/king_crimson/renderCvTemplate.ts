import fs from 'fs';
import path from 'path';
import type { UpdatedResume } from '@repo/type-definitions/updated-resume';
import markdownToHtml from './markdownToHtml';

/**
 * Escapes characters for HTML content to prevent XSS/rendering issues
 */
function escapeHtml(text: string | null | undefined): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Renders the HTML template with the given resume entry data.
 */
export function renderCvTemplate(entry: UpdatedResume, qrCodeDataUrl?: string): string {
    const templatePath = path.resolve(__dirname, '../../assets/cv_template.html');
    if (!fs.existsSync(templatePath)) {
        throw new Error(`HTML template file not found at ${templatePath}`);
    }

    let html = fs.readFileSync(templatePath, 'utf-8');

    // 1. Process basic placeholders
    html = html.replace(/{{name}}/g, escapeHtml(entry.name));
    html = html.replace(/{{job_title}}/g, escapeHtml(entry.title));
    html = html.replace(/{{email}}/g, escapeHtml(entry.email));
    html = html.replace(/{{website}}/g, escapeHtml(entry.website));
    html = html.replace(/{{github_profile_link}}/g, escapeHtml(entry.github_profile_link));

    // Handle background summary markdown -> HTML
    const backgroundText = entry.background_rich_text || entry.background || '';
    const backgroundHtml = markdownToHtml(backgroundText);
    html = html.replace(/{{background}}/g, backgroundHtml);

    // QR Code URL (Base64 data URL or fallback)
    const qrUrl = qrCodeDataUrl || '';
    html = html.replace(/{{qr_code_url}}/g, qrUrl);

    // 2. Render Experience Section
    const experienceList = entry.experience_list_items || [];
    const expSlotStyles = [
        {
            posClass: 'pdf24_22 pdf24_08 pdf24_42',
            posStyle: 'text-transform: uppercase;',
            compClass: 'pdf24_22 pdf24_08 pdf24_43',
            compStyle: 'text-transform: uppercase;',
            metaClass: 'pdf24_19 pdf24_08 pdf24_44',
            metaStyle: 'word-spacing: 0.0016em; font-size: 11pt !important;',
            descClass: 'pdf24_19 pdf24_08 pdf24_52',
        },
        {
            posClass: 'pdf24_22 pdf24_08 pdf24_23',
            posStyle: 'text-transform: uppercase;',
            compClass: 'pdf24_22 pdf24_08 pdf24_55',
            compStyle: 'text-transform: uppercase;',
            metaClass: 'pdf24_19 pdf24_08 pdf24_43',
            metaStyle: 'word-spacing: -0.0021em; font-size: 11pt !important;',
            descClass: 'pdf24_19 pdf24_08 pdf24_44',
        },
        {
            posClass: 'pdf24_22 pdf24_08 pdf24_61',
            posStyle: 'text-transform: uppercase;',
            compClass: 'pdf24_22 pdf24_08 pdf24_30',
            compStyle: 'text-transform: uppercase;',
            metaClass: 'pdf24_19 pdf24_08 pdf24_62',
            metaStyle: 'word-spacing: 0.0066em; font-size: 11pt !important;',
            descClass: 'pdf24_19 pdf24_08 pdf24_64',
        },
        {
            posClass: 'pdf24_22 pdf24_08 pdf24_40',
            posStyle: 'text-transform: uppercase;',
            compClass: 'pdf24_22 pdf24_08 pdf24_67',
            compStyle: 'text-transform: uppercase;',
            metaClass: 'pdf24_19 pdf24_08 pdf24_31',
            metaStyle: 'word-spacing: 0.0032em; font-size: 11pt !important;',
            descClass: 'pdf24_19 pdf24_08 pdf24_40',
        },
    ];

    let experienceItemsHtml = '';
    experienceList.forEach((item, index) => {
        const position = escapeHtml(item.position);
        const company = escapeHtml(item.company);
        const client = item.client ? escapeHtml(item.client) : '';
        const companyDisplay = client ? `${company} (for ${client})` : company;
        const location = escapeHtml(item.location);
        const from = escapeHtml(item.from);
        const until = escapeHtml(item.until);
        const descriptionHtml = markdownToHtml(item.description);

        const style = expSlotStyles[index % expSlotStyles.length];

        const headerHtml = `
            <span class="${style.compClass}" style="${style.compStyle}">${position}  |  ${companyDisplay} &nbsp;</span>
        `;
        const metaHtml = `<span class="${style.metaClass}" style="${style.metaStyle}">${location}.  |  ${from} – ${until}.</span>`;
        const descHtml = `<div class="${style.descClass}" style="font-size: 11.5pt;">${descriptionHtml}</div>`;

        experienceItemsHtml += `
            <div style="display: flex; flex-direction: column; gap: 0.2em; width: 100%;">
                <div style="line-height: 1.22em; white-space: normal;">${headerHtml}</div>
                <div style="line-height: 1.22em; white-space: normal;">${metaHtml}</div>
                <div style="line-height: 1.22em; white-space: normal; width: 100%;">${descHtml}</div>
            </div>
        `;
    });
    html = html.replace(/{{experience_items}}/g, experienceItemsHtml);

    // 3. Render Education Section
    const educationList = entry.education_list_items || [];
    const eduSlotStyles = [
        {
            titleClass: 'pdf24_22 pdf24_08 pdf24_23',
            metaClass: 'pdf24_19 pdf24_08 pdf24_24',
            datesClass: 'pdf24_19 pdf24_08 pdf24_25',
        },
        {
            titleClass: 'pdf24_22 pdf24_08 pdf24_31',
            metaClass: 'pdf24_19 pdf24_08 pdf24_20',
            datesClass: 'pdf24_19 pdf24_08 pdf24_25',
        },
        {
            titleClass: 'pdf24_22 pdf24_08 pdf24_37',
            metaClass: 'pdf24_19 pdf24_08 pdf24_34',
            datesClass: 'pdf24_19 pdf24_08 pdf24_25',
        },
    ];

    let educationItemsHtml = '';
    educationList.forEach((item, index) => {
        const title = escapeHtml(item.title);
        const institute = escapeHtml(item.institute);
        const country = escapeHtml(item.country);
        const from = escapeHtml(item.from);
        const until = escapeHtml(item.until);

        const style = eduSlotStyles[index % eduSlotStyles.length];

        educationItemsHtml += `
            <div style="display: flex; flex-direction: column; gap: 0.05em; line-height: 1.15em;">
                <div style="white-space: normal;">
                    <span class="${style.titleClass}" style="font-size: 10.5pt;">${title}</span><br/>
                    <span class="${style.metaClass}" style="font-size: 10pt;">${institute}. ${country}.</span>
                </div>
                <div>
                    <span class="${style.datesClass}">${from} – ${until}</span>
                </div>
            </div>
        `;
    });
    html = html.replace(/{{education_items}}/g, educationItemsHtml);

    return html;
}

export default renderCvTemplate;
