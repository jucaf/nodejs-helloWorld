#!/usr/bin/env groovy

def jenkinsFile
def gitDefaultProjectConfigurationPath='https://github.com/isanmartin0/evo-cicd-generic-configuration'
def gitNodejsDefaultProjectConfigurationPath='https://github.com/jucaf/evo-cicd-nodejs-generic-configuration'
def gitAngularDefaultProjectConfigurationPath='https://github.com/isanmartin0/evo-cicd-angular-generic-configuration'
def gitDefaultProjectConfigurationJenkinsFile='Jenkinsfile'
def gitDefaultProjectConfigurationBranch='master'
def gitDefaultProjectConfigurationCredentials='4b18ea85-c50b-40f4-9a81-e89e44e20178' //credentials for the generic configuration project
def gitDefaultProjectConfigurationJenkinsNode=''
def mavenApplicationFile='pom.xml'
def nodeApplicationFile='package.json'
def angularApplicationFile='tsconfig.json'
def isMavenApplication=false
def isNodejsApplication=false
def isAngularApplication=false
def isAngularTsConfigFile=false
def isAngularPackageFile=false
def isAngularIncorrectAplication=false
def projectURL=''

node() {
  stage('Detect application type') {
    echo "Detecting application type"
    checkout scm

    echo "Checking Maven application type"
    isMavenApplication = fileExists mavenApplicationFile

    if (isMavenApplication) {
      echo "${mavenApplicationFile} file ... FOUND."

      try {
        def pom = readMavenPom()
        echo "${mavenApplicationFile} file ... CORRECT."
        echo "Is a Maven application type"
      }
      catch (exc) {
        echo "${mavenApplicationFile} file ... INCORRECT."
        isMavenApplication=false
      }

    } else {
      echo "${mavenApplicationFile} file ... NOT FOUND."
    }

    if (!isMavenApplication) {
        echo "Checking Angular application type"
        isAngularTsConfigFile = fileExists angularApplicationFile
        isAngularPackageFile = fileExists nodeApplicationFile

        isAngularApplication = isAngularTsConfigFile && isAngularPackageFile

        if (isAngularApplication) {
            echo "${angularApplicationFile} file ... FOUND"
            echo "${nodeApplicationFile} file ... FOUND"


            try {
              def tsconfigJSON = readJSON file: angularApplicationFile
              echo "${angularApplicationFile} file ... CORRECT"
            }
            catch (exc) {
              echo "${angularApplicationFile} file ... INCORRECT."
              isAngularApplication=false
              isAngularIncorrectAplication=true
            }

            try {
                def angularPackageJSON = readJSON file: nodeApplicationFile
                echo "${nodeApplicationFile} file ... CORRECT"
            }
            catch (exc) {
              echo "${nodeApplicationFile} file ... INCORRECT."
              isAngularApplication=false
              isAngularIncorrectAplication=true
            }

            if (isAngularApplication && !isAngularIncorrectAplication) {
                echo "Is an Angular application type"
            }
        } else {
            if (isAngularTsConfigFile) {
                echo "${angularApplicationFile} file ... FOUND."
            } else {
                echo "${angularApplicationFile} file ... NOT FOUND."
            }
            if (isAngularPackageFile) {
                echo "${nodeApplicationFile} file ... FOUND."
            } else {
                echo "${nodeApplicationFile} file ... NOT FOUND."
            }
        }
    }

    if (!isMavenApplication && !isAngularApplication && !isAngularIncorrectAplication) {

      echo "Checking NodeJS application type"
      isNodejsApplication = fileExists nodeApplicationFile

      if (isNodejsApplication) {
        echo "${nodeApplicationFile} file ... FOUND."
        try {
          def packageJSON = readJSON file: nodeApplicationFile
          echo "${nodeApplicationFile} file ... CORRECT."
          echo "Is a NodeJS application type"
        }
        catch (exc) {
          echo "${nodeApplicationFile} file ... INCORRECT."
          isNodejsApplication=false
        }
      } else {
       	 echo "${nodeApplicationFile} file ... NOT FOUND."
      }
    }

    if (!isMavenApplication && !isAngularApplication && !isNodejsApplication) {
     	throw new hudson.AbortException("A correct application type not found. The allowed application types are Maven, Angular and NodeJS")
    }

  }
}
stage('Generic Jenkinsfile (PGC) load') {

  if (isMavenApplication) {

    echo "Loading Maven Jenkins pipeline (PGC)"

    jenkinsFile = fileLoader.fromGit(gitDefaultProjectConfigurationJenkinsFile,
                                     gitDefaultProjectConfigurationPath,
                                     gitDefaultProjectConfigurationBranch,
                                     gitDefaultProjectConfigurationCredentials,
                                     gitDefaultProjectConfigurationJenkinsNode)

	jenkinsFile.runGenericJenkinsfile()



  } else if (isAngularApplication) {

		echo "Loading Angular Jenkins pipeline (PGC)"

    	jenkinsFile = fileLoader.fromGit(gitDefaultProjectConfigurationJenkinsFile,
                                     	 gitAngularDefaultProjectConfigurationPath,
                                     	 gitDefaultProjectConfigurationBranch,
                                     	 gitDefaultProjectConfigurationCredentials,
                                     	 gitDefaultProjectConfigurationJenkinsNode)

  		jenkinsFile.runAngularGenericJenkinsfile()

  } else if (isNodejsApplication) {

		echo "Loading NodeJS Jenkins pipeline (PGC)"

    	jenkinsFile = fileLoader.fromGit(gitDefaultProjectConfigurationJenkinsFile,
                                     	 gitNodejsDefaultProjectConfigurationPath,
                                     	 gitDefaultProjectConfigurationBranch,
                                     	 gitDefaultProjectConfigurationCredentials,
                                     	 gitDefaultProjectConfigurationJenkinsNode)

  		jenkinsFile.runNodejsGenericJenkinsfile()

  } else {
    throw new hudson.AbortException("A correct application type not found. The allowed application types are Maven, Angular and NodeJS")
  }

}
