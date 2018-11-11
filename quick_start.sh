#!/usr/bin/env bash

# make sure everything is clean and well setup
echo "[quick_start.sh] First time setup"
./first_time_setup.sh

# start blockchain and put in background
echo "[quick_start.sh] Starting eosio docker"
./start_eosio_docker.sh --nolog

# wait until eosio blockchain to be started
until $(curl --output /dev/null \
             --silent \
             --head \
             --fail \
             localhost:8888/v1/chain/get_info)
do
  echo "Waiting eosio blockchain to be started..."
  sleep 2s
done


./scripts/create_accounts.sh
./scripts/create_mock_data.sh

./scripts/deploy_contract.sh eosio.token eosio.token notechainwal $(cat eosiomain_wallet_password.txt)

echo docker exec -it eosio_notechain_container bash
echo cleos push action eosio.token create '[ "eosio", "1000000000.0000 COLLAB"]' -p eosio.token@active

