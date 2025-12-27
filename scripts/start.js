
import concurrently from 'concurrently';
import figlet from 'figlet';
import gradient from 'gradient-string';
import ora from 'ora';

console.clear();

// Display Banner
const displayBanner = () => {
    return new Promise((resolve) => {
        figlet('MANDATED', { font: 'Slant' }, (err, data) => {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(gradient.pastel.multiline(data));
            console.log(gradient.cristal('\n   SYSTEM INITIALIZATION SEQUENCE   \n'));
            resolve();
        });
    });
};

const run = async () => {
    await displayBanner();

    const spinner = ora('Initializing subsystems...').start();

    await new Promise(r => setTimeout(r, 1000));
    spinner.color = 'yellow';
    spinner.text = 'Establishing secure connections...';

    await new Promise(r => setTimeout(r, 800));
    spinner.color = 'magenta';
    spinner.text = 'Loading AI Core...';

    await new Promise(r => setTimeout(r, 800));
    spinner.succeed(gradient('green', 'cyan')('SYSTEM ONLINE'));
    console.log('');

    const { result } = concurrently(
        [
            {
                command: 'npm run dev',
                name: 'UI-NET',
                prefixColor: 'cyan',
                env: { FORCE_COLOR: 'true' }
            },
            {
                command: 'cd backend && encore run',
                name: 'CORE-DB',
                prefixColor: 'magenta',
                env: { FORCE_COLOR: 'true' }
            }
        ],
        {
            prefix: 'name',
            killOthersOn: ['failure', 'success'],
            restartTries: 3,
        }
    );

    result.then(
        () => console.log('All processes terminated'),
        () => console.log('Process termination')
    );
};

run();
