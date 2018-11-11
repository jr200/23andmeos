#!/usr/bin/env bash
# set -o errexit

# set PATH
PATH="$PATH:/opt/eosio/bin"

cleos wallet list unlock -n notechainwal --password $(cat eosiomain_wallet_password.txt)

# cd into script's folder
cd "$(dirname "$0")"

echo "=== create mock posts ==="

# $(cat notechain_wallet_password.txt)

# import bobross account private key and create mock posts under bobross
cleos wallet import -n notechainwal --private-key 5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5

# download jq for json reader, we use jq here for reading the json file ( accounts.json )
mkdir -p ~/bin && curl -sSL -o ~/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && chmod +x ~/bin/jq && export PATH=$PATH:~/bin

# loop through the array in the json file and run createpost action on smart contract to add mock data

# jobs database
jq -c '.[]' mock_jobs.json | while read i; do
  timestamp=$(jq -r '.timestamp' <<< "$i")
  employer=$(jq -r '.employer' <<< "$i")
  title=$(jq -r '.title' <<< "$i")
  description=$(jq -r '.description' <<< "$i")
  maxeosprice=$(jq -r '.maxeosprice' <<< "$i")

  # push the createpost action to the smart contract
  cleos push action notechainacc emppostjob "[ $timestamp, "\""$employer"\"", "\""$title"\"", "\""$description"\"", $maxeosprice ]" -p bobross@active
done
