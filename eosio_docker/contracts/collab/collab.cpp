#include "collab.hpp"

using namespace eosio;
using std::string;

// use CONTRACT macro to declare this as a contract class
CONTRACT collab : public contract
{
  // collab class inherits the eosio “contract” smart contract and uses its constructor below
  using contract::contract;

public:
  // constructor
  collab(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds),
                                                                  _posts(receiver, receiver.value) {}

  // use macro so that eosio-cpp will add this as an to the ABI
  ACTION emppostjob(const uint64_t timestamp, const name caller,
                    const string &title, const string &desc, uint64_t max_px_eos, const string &deadline)
  {
  }

  ACTION devbidjob(const uint64_t timestamp, const name caller,
                   const uint64_t jobid, const string &bidder, uint64_t dev_cost_eos, uint64_t dev_hours)
  {
  }

  ACTION empgetbids(const uint64_t timestamp, const name caller,
                    const uint64_t jobid)
  {
  }

  ACTION empacceptbid(const uint64_t timestamp, const name caller,
                      const uint64_t jobid, const uint64_t bidid, const uint64_t stake)
  {
  }

  ACTION empmsgdev(const uint64_t timestamp, const name caller,
                   const name emp, const uint64_t jobid, const string &msg)
  {
  }

  ACTION devmsgemp(const uint64_t timestamp, const name caller,
                   const name dev, const uint64_t jobid, const string &msg)
  {
  }

  ACTION devsetjobdone(const uint64_t timestamp, const name caller,
                       const uint64_t jobid, const uint64_t bidid)
  {
  }

  ACTION empsetjobdone(const uint64_t timestamp, const name caller,
                       const uint64_t jobid, const uint64_t bidid)
  {
  }

  ACTION empraisearb(const uint64_t timestamp, const name caller,
                     const uint64_t jobid, const uint64_t bidid, const string &reason)
  {
  }

  ACTION devraisearb(const uint64_t timestamp, const name caller,
                     const uint64_t jobid, const uint64_t bidid, const string &reason)
  {
  }

  ACTION assignarb(const uint64_t timestamp, const name caller,
                   const uint64_t jobid, const name dev)
  {
  }

  ACTION arbsetresult(const uint64_t timestamp, const name caller,
                      const uint64_t jobid, const uint64_t bidid, const uint64_t goodorbad, const string &reason)
  {
    // set job done or job not done
  }

private:
  // use TABLE macro so that eosio-cpp will add this as a multi_index to the ABI
  TABLE poststruct
  {
    uint64_t pkey;
    name author;
    uint128_t skey;

    // primary key
    uint64_t primary_key() const { return pkey; }

    // secondary key
    // only supports uint64_t, uint128_t, uint256_t, double or long double
    uint128_t get_by_skey() const { return skey; }
  };

  TABLE jobstruct
  {
    uint64_t jobid;
    name employer;
    uint128_t skey;
    string title;
    string description;
    uint64_t maxpriceeos;

    // primary key
    uint64_t primary_key() const { return jobid; }

    // secondary key
    // only supports uint64_t, uint128_t, uint256_t, double or long double
    uint128_t get_by_skey() const { return skey; }
  };

  typedef eosio::multi_index<name("jobstruct"),
                             jobstruct,
                             indexed_by<name("getbyskey"),
                                        const_mem_fun<jobstruct, uint128_t, &jobstruct::get_by_skey>>>
      job_table;

  TABLE bidstruct
  {
    uint64_t bidid;
    name developer;
    uint128_t skey;
    uint64_t bidpriceeos;
    uint64_t bidtimehours;

    // primary key
    uint64_t primary_key() const { return bidid; }

    // secondary key
    // only supports uint64_t, uint128_t, uint256_t, double or long double
    uint128_t get_by_skey() const { return skey; }
  };

  typedef eosio::multi_index<name("bidstruct"),
                             bidstruct,
                             indexed_by<name("getbyskey"),
                                        const_mem_fun<bidstruct, uint128_t, &bidstruct::get_by_skey>>>
      bid_table;

  TABLE devstruct
  {
    uint64_t devid;
    name devname;
    uint128_t skey;
    uint64_t rating;

    // primary key
    uint64_t primary_key() const { return devid; }

    // secondary key
    // only supports uint64_t, uint128_t, uint256_t, double or long double
    uint128_t get_by_skey() const { return skey; }
  };

  typedef eosio::multi_index<name("devstruct"),
                             devstruct,
                             indexed_by<name("getbyskey"),
                                        const_mem_fun<devstruct, uint128_t, &devstruct::get_by_skey>>>
      developer_table;

  TABLE employstruct
  {
    uint64_t empid;
    name empname;
    uint128_t skey;
    uint64_t rating;

    // primary key
    uint64_t primary_key() const { return empid; }

    // secondary key
    // only supports uint64_t, uint128_t, uint256_t, double or long double
    uint128_t get_by_skey() const { return skey; }
  };

  typedef eosio::multi_index<name("employstruct"),
                             employstruct,
                             indexed_by<name("getbyskey"),
                                        const_mem_fun<employstruct, uint128_t, &employstruct::get_by_skey>>>
      employer_table;

  // create a multi-index table and support a secondary key
  // typedef multi_index<name(table_name), object_template_to_use, other_indices> multi_index_name;
  typedef eosio::multi_index<name("poststruct"), poststruct,
                             indexed_by<name("getbyskey"), const_mem_fun<poststruct, uint128_t, &poststruct::get_by_skey>>>
      post_table;

  post_table _posts;
};

EOSIO_DISPATCH(collab, (emppostjob)(devbidjob)(empgetbids)(empacceptbid)(empmsgdev)(devmsgemp)(devsetjobdone)(empsetjobdone)(empraisearb)(devraisearb)(assignarb)(arbsetresult))
