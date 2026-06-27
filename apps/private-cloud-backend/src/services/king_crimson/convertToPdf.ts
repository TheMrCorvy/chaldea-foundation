import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const convertDocxToPdf = async (docxPath: string, pdfPath: string): Promise<void> => {
    const absoluteDocx = path.resolve(docxPath).replace(/\//g, '\\');
    const absolutePdf = path.resolve(pdfPath).replace(/\//g, '\\');

    const psCommand = `& {
        $word = New-Object -ComObject Word.Application;
        $word.Visible = $false;
        $doc = $word.Documents.Open('${absoluteDocx}');
        $doc.SaveAs('${absolutePdf}', 17);
        $doc.Close();
        $word.Quit();
    }`;

    const base64Command = Buffer.from(psCommand, 'utf16le').toString('base64');
    const command = `powershell.exe -NoProfile -NonInteractive -EncodedCommand ${base64Command}`;

    await execAsync(command);
};

export default convertDocxToPdf;
