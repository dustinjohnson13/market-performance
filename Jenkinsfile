#!groovy

import groovy.json.JsonOutput

stage('Run') {
    node {
        def build = "${env.JOB_NAME} - #${env.BUILD_NUMBER}".toString()
        def emailAddress = "${env.EMAIL}".toString()
        def email

        currentBuild.result = "SUCCESS"

        try {
            checkout scm

            def output = sh(script: './gradlew run', returnStdout: true)
            def body = (output =~ /(?ms)<html>.*<\/html>/)[0]
            email = [to: emailAddress, from: emailAddress, subject: "Market Performance - ${new Date().format('yyyy/MM/dd')}", body: "${body}"]
        } catch (err) {
            currentBuild.result = "FAILURE"

            email = [to: emailAddress, from: emailAddress, subject: "$build failed!", body: "${env.JOB_NAME} failed! See ${env.BUILD_URL} for details."]

            throw err
        } finally {
            emailext mimeType: 'text/html', body: email.body, recipientProviders: [[$class: 'DevelopersRecipientProvider']], subject: email.subject, to: "${env.EMAIL}"
        }
    }
}
