#!/bin/sh

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$KUBECONFIG_PASSPHRASE" \
--output $HOME/secrets/kubeconfig app/k8s/kubeconfig.gpg