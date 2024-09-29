# Directory Structure

* sarex-toolset
  * sarex: The main CLI tool containing DR Extractor, CI Extractor, and Connector Bulider
  * go-dependencies-reader: DR Extractor plugin for Go language.
  * JavaDependenciesReader: DR Extractor plugin for Java language.
  * js-dependencies-reader: DR Extractor plugin for JavaScript/TypeScript language.
  * mapping-rule-builder: Mapping Rule Builder (GUI tool)

* reconstruction
  * bss: The results of the case study for Building Security System(BSS)
  * trust-chain-services: The results of the case study for Trust Chain Services
  * trust-data-connectome: The results of the case study for Trust Data Connectome
  * sarex-database: A backup of MongoDB storing all the data generated during the three case studies above

# The skill set required to use the CBSAR toolset

* The skill to execute command-line programs using a terminal application
* The skill to execute a local server on a terminal application and connect this local server via a browser

# Guideline to use this tool

## Installation

### sarex command line tool

`sarex` command line tool is built from the source code. First, move to `sarex` directory, then run the following command.

```
cargo build
```

Then, `cargo` will build a binary of `sarex-toolset/sarex` in `target/debug` directory. (This is a Rust project, so basically Rust should be installed first.)

After building the `sarex` command line tool, you need to setup a directory for the configuration of `sarex`.

The directory for the configuration of `sarex` is `$HOME/.sarex`. The structure of `$HOME/.sarex` is as below:

```
$HOME/.sarex
|-- config.json
|-- plugins
|   |-- java
|   |-- js
|   |-- go
```

`config.json` looks like below:

```
{
  "db_url": "http://localhost:27017",
  "project_id": ""
}

```

In `plugins` directory, the programs to extract dependency relations are located. You can find source code of those plugins in `sarex-toolset` directory of this project.

* `go-dependencies-reader`: a program to extract dependency relations for Go language
* `JavaDependenciesReader`: a program to extract dependency relations for Java language
* `js-dependencies-reader`: a program to extract dependency relations for JavaScript language

For Go, you need to build `go-dependencies-reader` project and create a binary named `go-dependencies-reader`. Then, locate this binary under `$HOME/.sarex/plugins/go` directory.

For Java, you need to build and package `JavaDependenciesReader` project to `JavaDependenciesReader.jar` file. Then, locate this JAR file under `$HOME/.sarex/plugins/java` directory.

For JavaScript, you need to copy the `js-dependencies-reader` project and paste it under `$HOME/.sarex/plugins/js` directory.

### Mapping Rule Builder

First of all, you need to install Node.js to run the mapping rule builder.

After installing Node.js, move `sarex-toolset/mapping-rule-builder` directory. Then, first you need to run the below command:

```
npm install
```

Then, you can run the mapping rule builder by the below command:

```
npm run dev
```

