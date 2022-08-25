import {join} from 'node:path';
import {ExecaChildProcess} from 'execa';
import getPort from 'get-port';
import 'isomorphic-fetch';
import waitOn from 'wait-on';
import {build} from '../../../src/command/build';
import {nextBuild, wranglerDev} from '../../util';

jest.setTimeout(20_000);

let wranglerProcess: ExecaChildProcess;
let wranglerPort: number;

beforeAll(async () => {
	await nextBuild(__dirname);
	await build(__dirname, join(__dirname, '.ignext'));
	wranglerPort = await getPort();
	wranglerProcess = wranglerDev(join(__dirname, '.ignext'), wranglerPort);
	await waitOn({resources: ['tcp:localhost:' + wranglerPort.toString()]});
});

test('No op test', async () => {
	expect(true);
});

test('test API', async () => {
	const response = await fetch(getHost() + '/api/hello');
	expect(await response.text()).toBe('Hello World');
});

afterAll(() => {
	wranglerProcess.kill('SIGTERM');
});

function getHost() {
	return join('http://localhost:' + wranglerPort.toString());
}
