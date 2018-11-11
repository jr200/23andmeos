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
                                                                  _jobs(receiver, receiver.value), _bids(receiver, receiver.value), _emps(receiver, receiver.value), _devs(receiver, receiver.value)
  {
  }

  ACTION registerdev(const uint64_t timestamp, const name caller,
                     const name devname)
  {
    // add to developer_table
  }

  ACTION registeremp(const uint64_t timestamp, const name caller,
                     const name empname)
  {
    // add to employer_table
  }

  // use macro so that eosio-cpp will add this as an to the ABI
  ACTION emppostjob(const uint64_t timestamp, const name employer,
                    const string &title, const string &desc, uint64_t maxpriceeos, const string &deadline)
  {
    // add to job_table
    uint128_t skey = static_cast<uint128_t>(employer.value) << 64 | timestamp;

    // _posts is our multi_index table
    // multi_index is how you store persistant data across actions in EOSIO
    // each action has a new action context which is a clean working memory with no prior working state from other action executions
    // we are adding a record to our table
    // const_iterator emplace( unit64_t payer, Lambda&& constructor )
    _jobs.emplace(employer, [&](auto &job) {
      job.jobid = _jobs.available_primary_key();
      job.skey = skey;
      job.employer = employer;
      job.title = title;
      job.maxpriceeos = maxpriceeos;
    });
  }

  ACTION devbidjob(const uint64_t timestamp, const name dev,
                   const uint64_t jobid, uint64_t bidpriceeos, uint64_t bidtimehours)
  {

    uint128_t skey = static_cast<uint128_t>(dev.value) << 64 | timestamp;

    _bids.emplace(dev, [&](auto &bid) {
      bid.bidid = _bids.available_primary_key();
      bid.jobid = jobid;
      bid.developer = dev;
      bid.skey = skey;
      bid.bidpriceeos = bidpriceeos;
      bid.bidtimehours = bidtimehours;
    });
  }

  ACTION empgetbids(const uint64_t timestamp, const name caller,
                    const uint64_t jobid)
  {
    // list all bids for jobid in the job_table
  }

  ACTION empacceptbid(const uint64_t timestamp, const name caller,
                      const uint64_t jobid, const uint64_t bidid, const uint64_t stake)
  {
    //
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
    uint64_t jobid;
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

  job_table _jobs;
  bid_table _bids;
  developer_table _devs;
  employer_table _emps;
};

EOSIO_DISPATCH(collab, (emppostjob)(devbidjob)(empgetbids)(empacceptbid)(empmsgdev)(devmsgemp)(devsetjobdone)(empsetjobdone)(empraisearb)(devraisearb)(assignarb)(arbsetresult))
