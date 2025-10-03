import * as core from '@actions/core';
import * as fs from 'fs';

async function run() {
  try {
    const repos = core.getInput('repositories').split(',');

    const actor = core.getInput('actor') || 'GITHUB_ACTOR';
    const token = core.getInput('token') || 'GITHUB_TOKEN';

    // Generate settings.xml
    let xml = `<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd">
      <servers>\n`;

    for (const repo of repos) {
      xml += `<server>
  <id>${repo}</id>
  <username>\${env.${actor}}</username>
  <password>\${env.${token}}</password>
</server>\n`;
    }

    xml += `</servers></settings>`;

    fs.mkdirSync(`${process.env.HOME}/.m2`, { recursive: true });
    fs.writeFileSync(`${process.env.HOME}/.m2/settings.xml`, xml);

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
