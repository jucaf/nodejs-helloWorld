#!/usr/bin/groovy
@Library('msa-cicd-nodejs-jenkins-shared-libs')_

import com.evobanco.NodejsUtils
import com.evobanco.NodejsConstants

//def runNodejsGenericJenkinsfile() {

    def utils = new com.evobanco.NodejsUtils()

    def artifactorySnapshotsURL = 'https://digitalservices.evobanco.com/artifactory/libs-snapshot-local'
    def artifactoryReleasesURL = 'https://digitalservices.evobanco.com/artifactory/libs-release-local'
    def sonarQube = 'http://sonarqube:9000'
    def openshiftURL = 'https://openshift.grupoevo.corp:8443'
    def openshiftCredential = 'openshift'
    def registry = '172.20.253.34'
    def artifactoryCredential = 'artifactory-token'
    def jenkinsNamespace = 'cicd'
    def params
    def envLabel
    def branchName
    def branchNameHY
    def branchType
    def artifactoryRepoURL

    //Parallet project configuration (PPC) properties
    def branchPPC = 'master'
    def credentialsIdPPCDefault = '4b18ea85-c50b-40f4-9a81-e89e44e20178' //credentials of the parallel configuration project
    def credentialsIdPPC
    def relativeTargetDirPPC = '/tmp/configs/PPC/'
    def isPPCJenkinsFile = false
    def isPPCJenkinsYaml = false
    def isPPCOpenshiftTemplate = false
    def jenkinsFilePathPPC = relativeTargetDirPPC + 'Jenkinsfile'
    def jenkinsYamlPathPPC = relativeTargetDirPPC + 'Jenkins.yml'
    def openshiftNodejsTemplatePathPPC = relativeTargetDirPPC + 'kube/nodejs_template.yaml'
    def jenknsFilePipelinePPC

    //Generic project configuration properties
    def gitDefaultProjectConfigurationPath='https://github.com/isanmartin0/nodejs-helloworld'
    def relativeTargetDirGenericPGC = '/tmp/configs/generic/'
    def branchGenericPGC = 'master'
    def credentialsIdGenericPGC = '4b18ea85-c50b-40f4-9a81-e89e44e20178' //credentials of the generic configuration project
    def jenkinsYamlGenericPath = relativeTargetDirGenericPGC + 'Jenkins.yml'
    def openshiftNodejsTemplateGenericPath = relativeTargetDirGenericPGC + 'kube/nodejs_template.yaml'
    def isGenericJenkinsYaml = false

    def packageJSON
    def projectURL
    def moduleName

    int maxOldBuildsToKeep = 0
    int daysOldBuildsToKeep = 0

    //Taurus parameters
    def taurus_test_base_path = 'src/test/taurus'
    def acceptance_test_path = '/acceptance_test/'
    def performance_test_path = '/performance_test/'
    def smoke_test_path = '/smoke_test/'
    def security_test_path = '/security_test/'


    def openshift_route_hostname = ''
    def openshift_route_hostname_with_protocol = ''




    def cont = 'Yes'

    echo "BEGIN NODE.JS GENERIC CONFIGURATION PROJECT (PGC)"

    node('nodejs') {

        stage('Checkout') {
            echo 'Getting source code...'
            checkout scm
        }


        try {
            def credentialsIdPPCArray = scm.userRemoteConfigs.credentialsId
            credentialsIdPPC = credentialsIdPPCArray.first()
            echo "Using credentialsIdPPCDefault value for access to Parallel Project Configuration (PPC)"

        } catch (exc) {
            echo 'There is an error on retrieving credentialsId of multibranch configuration'
            def exc_message = exc.message
            echo "${exc_message}"

            credentialsIdPPC = credentialsIdPPCDefault
        }

        echo "credentialsIdPPC: ${credentialsIdPPC}"

        stage('Detect Node.js Parallel project configuration (PPC)') {

            packageJSON = readJSON file: 'package.json'
            projectURL = packageJSON.repository.url
            echo "projectURL: ${projectURL}"


            moduleName = packageJSON.name
            echo "moduleName: ${moduleName}"
/*
            try {
                def parallelConfigurationProject = utils.getParallelConfigurationProjectURL(projectURL, moduleName)

                echo "Node.js parallel configuration project ${parallelConfigurationProject} searching"

                retry (3)
                        {
                            checkout([$class                           : 'GitSCM',
                                      branches                         : [[name: branchPPC]],
                                      doGenerateSubmoduleConfigurations: false,
                                      extensions                       : [[$class           : 'RelativeTargetDirectory',
                                                                           relativeTargetDir: relativeTargetDirPPC]],
                                      submoduleCfg                     : [],
                                      userRemoteConfigs                : [[credentialsId: credentialsIdPPC,
                                                                           url          : parallelConfigurationProject]]])
                        }
                echo "Node.js Parallel configuration project ${parallelConfigurationProject} exits"

                // Jenkinsfile
                isPPCJenkinsFile = fileExists jenkinsFilePathPPC

                if (isPPCJenkinsFile) {
                    echo "Node.js Parallel configuration project Jenkinsfile... FOUND"
                } else {
                    echo "Node.js Parallel configuration project Jenkinsfile... NOT FOUND"
                }


                // Jenkins.yml
                isPPCJenkinsYaml = fileExists jenkinsYamlPathPPC

                if (isPPCJenkinsYaml) {
                    echo "Node.js Parallel configuration project Jenkins.yml... FOUND"
                } else {
                    echo "Node.js Parallel configuration project Jenkins.yml... NOT FOUND"
                }

                // Openshift template (template.yaml)
                isPPCOpenshiftTemplate = fileExists openshiftTemplatePathPPC

                if (isPPCOpenshiftTemplate) {
                    echo "Node.js Parallel configuration project Openshift template... FOUND"
                } else {
                    echo "Node.js Parallel configuration project Openshift template... NOT FOUND"
                }


                echo "isPPCJenkinsFile : ${isPPCJenkinsFile}"
                echo "isPPCJenkinsYaml : ${isPPCJenkinsYaml}"
                echo "isPPCOpenshiftTemplate : ${isPPCOpenshiftTemplate}"

            }
            catch (exc) {
                echo 'There is an error on retrieving Node.js parallel project configuration'
                def exc_message = exc.message
                echo "${exc_message}"
            }
*/

        }



        if (isPPCJenkinsFile) {

            stage('Switch to Node.js parallel configuration project Jenkinsfile') {

                echo "Loading Jenkinsfile from Node.js Parallel Configuration Project (PPC)"

                jenknsFilePipelinePPC = load jenkinsFilePathPPC

                echo "Jenkinsfile from Node.js Parallel Configuration Project (PPC) loaded"

                echo "Executing Jenkinsfile from Node.js Parallel Configuration Project (PPC)"

                jenknsFilePipelinePPC.runNodejsPPCJenkinsfile()
            }


        } else {
            echo "Executing Jenkinsfile from Node.js Generic Configuration Project (PGC)"

            stage('Load Node.js pipeline configuration') {

                if (isPPCJenkinsYaml && isPPCOpenshiftTemplate) {
                    //The generic pipeline will use Jenkins.yml and template of the parallel project configuration

                    //Take parameters of the parallel project configuration (PPC)
                    params = readYaml  file: jenkinsYamlPathPPC
                    echo "Using Jenkins.yml from Node.js parallel project configuration (PPC)"

                    //The template is provided by parallel project configuration (PPC)
                    params.openshift.templatePath = relativeTargetDirPPC + params.openshift.templatePath
                    echo "Template provided by Node.js parallel project configuration (PPC)"

                    assert params.openshift.templatePath?.trim()

                    echo "params.openshift.templatePath: ${params.openshift.templatePath}"

                } else {
                    //The Node.js generic pipeline will use Node.js generic Jenkins.yml or Node.js generic Openshift template
                    //We need load this elements

                    echo "Node.js generic configuration project loading"

                    retry (3) {
                        checkout([$class                           : 'GitSCM',
                                  branches                         : [[name: branchGenericPGC]],
                                  doGenerateSubmoduleConfigurations: false,
                                  extensions                       : [[$class           : 'RelativeTargetDirectory',
                                                                       relativeTargetDir: relativeTargetDirGenericPGC]],
                                  submoduleCfg                     : [],
                                  userRemoteConfigs                : [[credentialsId: credentialsIdGenericPGC,
                                                                       url          : gitDefaultProjectConfigurationPath]]])
                    }

                    echo "Node.js generic configuration project loaded"


                    if (isPPCJenkinsYaml) {
                        //Take parameters of the parallel project configuration (PPC)
                        params = readYaml  file: jenkinsYamlPathPPC
                        echo "Using Jenkins.yml from Node.js parallel project configuration (PPC)"
                    } else {
                        //Take the generic parameters
                        params = readYaml  file: jenkinsYamlGenericPath
                        echo "Using Jenkins.yml from Node.js generic project"
                    }


                    if (isPPCOpenshiftTemplate) {
                        //The template is provided by parallel project configuration (PPC)
                        params.openshift.templatePath = relativeTargetDirPPC + params.openshift.templatePath
                        echo "Template provided by Node.js parallel project configuration (PPC)"
                    } else {
                        //The tamplate is provided by generic configuration
                        params.openshift.templatePath = relativeTargetDirGenericPGC + params.openshift.templatePath
                        echo "Template provided by Node.js generic configuration project"
                    }

                    assert params.openshift.templatePath?.trim()

                    echo "params.openshift.templatePath: ${params.openshift.templatePath}"


                }

            }


            stage('Initialize') {
                echo 'Initializing...'
                def node = tool name: 'Node-9.5.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                env.PATH = "${node}/bin:${env.PATH}"

                sh "node -v"

            }


            stage('TEST npm whoami') {
                withNPM(npmrcConfig: 'my-custom-npmrc') {
                    sh 'npm whoami'
                }
            }

cont = input message: 'Waiting for user approval',
parameters: [choice(name: 'Continue?', choices: 'No\nYes', description: 'Choose "Yes" if you want to continue this build')]



            stage('Prepare') {
                echo "Prepare stage (PGC)"

                nodejsSetDisplayName()

                echo "${currentBuild.displayName}"

                branchName = utils.getBranch()
                echo "We are on branch ${branchName}"
                branchType = utils.getBranchType(branchName)
                echo "This branch is a ${branchType} branch"
                branchNameHY = branchName.replace("/", "-").replace(".", "-").replace("_","-")
                echo "Branch name processed: ${branchName}"

/*



                artifactoryRepoURL = (branchType == 'master' || branchType == 'release' || branchType == 'hotfix')  ? artifactoryReleasesURL : artifactorySnapshotsURL

                def isValidVersion = utils.isValidBranchPomVersion(pom.version, branchType)

                if (!isValidVersion) {
                    //Sufix -SNAPSHOT is required for develop and feature branch types and is forbidden for release,hotfix and master branch types
                    currentBuild.result = Constants.FAILURE_BUILD_RESULT
                    throw new hudson.AbortException('Version of artifact in pom is not allowed for this type of branch')
                }
*/

            }



//            if (branchName != 'master')
//            {



                stage('Build') {
                    echo 'Building dependencies...'
                    sh 'npm i'
                }

                if (branchType in params.testing.predeploy.unitTesting) {
                    stage('Test') {

                        echo 'Installing jest'
                        sh 'npm i -D jest'

                        echo 'Installing jest-sonar-reporter'
                        sh 'npm i -D jest-sonar-reporter'

                        echo 'Testing...'
                        sh 'npm test'

/*
                        echo 'Publishing Test Coverage...'
                        		publishHTML (target: [
                        			allowMissing: false,
                        			alwaysLinkToLastBuild: false,
                        			keepAll: true,
                        			reportDir: 'coverage/lcov-report',
                        			reportFiles: 'index.html',
                        			reportName: "Application Test Coverage"
                        		])
*/
                    }
                } else {
                    echo "Skipping unit tests..."
                }



                if (branchType in params.testing.predeploy.sonarQube) {
                    stage('SonarQube') {
                        echo "Running SonarQube..."

                        def sonar_project_key = moduleName + "-" + branchNameHY
                        def sonar_project_name = moduleName + "-" + branchNameHY

                        echo "sonar_project_key: ${sonar_project_key}"
                        echo "sonar_project_name: ${sonar_project_name}"

                        echo "Replacing sonar.project.key and sonar.project.name variables with real values"
                        sh "sed -i -e 's/{sonarProjectKeyPlaceholder}/${sonar_project_key}/g' sonar-project.properties"
                        sh "sed -i -e 's/{sonarProjectNamePlaceholder}/${sonar_project_name}/g' sonar-project.properties"

                        // requires SonarQube Scanner 3.1+
                        def scannerHome = tool 'SonarQube Scanner 3.1.0';
                        withSonarQubeEnv('sonarqube') {
                          sh "${scannerHome}/bin/sonar-scanner -X"
                        }




                    }
                } else {
                    echo "Skipping Running SonarQube..."
                }





                cont = input message: 'Waiting for user approval',
                parameters: [choice(name: 'Continue?', choices: 'No\nYes', description: 'Choose "Yes" if you want to continue this build')]




//            } else {
//                // Is the master branch. Check the existence of artifact on Artifactory



//            }


        }

    } // end of node


    echo "END NODE.JS GENERIC CONFIGURATION PROJECT (PGC)"

//} //end of method

//return this;

