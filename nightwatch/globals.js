import waitOn from 'wait-on';
import {spawn} from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

let serverPid = null;
const serverPort = '13370';

export default {
  before(done) {
    // serve --listen 13370 ./test-app
    const currentDir = dirname(fileURLToPath(import.meta.url));
    serverPid = spawn(resolve('node_modules/.bin/serve'), ['--listen', serverPort, '--no-request-logging', join(currentDir, 'test-app')], {
      cwd: process.cwd(),
      stdio: 'inherit'
    }).pid;

    waitOn({
      resources: [`http://localhost:${serverPort}`]
    }).then(() => {
      setTimeout(done, 500);
    });

  },

  after() {
    if (serverPid) {
      process.kill(serverPid);
    }
  }
};
