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