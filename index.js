#!/usr/bin/env node
const {Command} = require("commander");
const {version} = require("./package.json");
const copy = require("recursive-copy");
const path = require("path");

/**
 * cli로 옵션을 접수
 * @type {Command}
 */
const program = new Command();
program
    .version(version)
    .requiredOption("-s, --sourceDir <path>", "사본을 만들 디렉토리의 이름")
    .requiredOption("-d ,--destinationDir <path>", "사본 디렉토리의 이름")
    .option("-e, --excludePathes <pathes...>", "제외할 파일 또는 디렉토리의 이름")
    .parse();

const {sourceDir, destinationDir, excludePathes = []} = program.opts();
const inDir = path.join(process.cwd(), sourceDir);
const outDir = path.join(process.cwd(), destinationDir);

/**
 * 사용자에게 입력받은 이름으로 nextjs-template 을 복사
 */
const options = {
    overwrite: true,
    expand: true,
    dot: true,
    junk: true,
    filter(path = "") {
        const report = excludePathes.map((excludePath) => {
            return path.indexOf(excludePath) > -1;
        });

        return !report.includes(true);
    },
};

copy(inDir, outDir, options)
    .on(copy.events.COPY_FILE_COMPLETE, (copyOperation) => {
        console.info("Copied to " + copyOperation.dest);
    })
    .catch((error) => console.error("Copy failed: " + error));
