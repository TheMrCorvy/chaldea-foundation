import getLinkedinRefreshToken from '../src/services/wuphf/utils/getLinkedinRefreshToken.util';

const main = async () => {
    const args = process.argv.slice(2);
    const code = args[0];

    await getLinkedinRefreshToken(code);
};

main();
