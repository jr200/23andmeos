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
    // add to developer_table, set rating 0
  }

  ACTION registeremp(const uint64_t timestamp, const name caller,
                     const name empname)
  {
    // add to employer_table, set rating 0
  }

  // use macro so that eosio-cpp will add this as an to the ABI
  ACTION emppostjob(const uint64_t timestamp,
                    const string &employer,
                    const string &title, const string &desc, uint64_t maxpriceeos)
  {
    // _posts is our multi_index table
    // multi_index is how you store persistant data across actions in EOSIO
    // each action has a new action context which is a clean working memory with no prior working state from other action executions
    // we are adding a record to our table
    // const_iterator emplace( unit64_t payer, Lambda&& constructor )
    _jobs.emplace(_self, [&](auto &job) {
      job.jobid = _jobs.available_primary_key();
      job.employer = employer;
      job.title = title;
      job.desc = desc;
      job.maxpriceeos = maxpriceeos;
    });
  }

  ACTION devbidjob(const uint64_t timestamp,
                   const uint64_t jobid, const string &dev, uint64_t bidpriceeos, uint64_t bidtimehours)
  {

    _bids.emplace(_self, [&](auto &bid) {
      bid.bidid = _bids.available_primary_key();
      bid.jobid = jobid;
      bid.developer = dev;
      bid.bidpriceeos = bidpriceeos;
      bid.bidtimehours = bidtimehours;
      bid.bidaccepted = 0;
    });
  }

  // ACTION empgetbids(const uint64_t timestamp, const name caller,
  //                   const uint64_t jobid)
  // {
  //   // list all bids for jobid in the job_table
  // }

  ACTION empacceptbid(const uint64_t timestamp, const name caller,
                      const uint64_t jobid, const uint64_t bidid, const uint64_t stake)
  {
    // auto post_index = _posts.get_index<name("getbyskey")>();
    // auto post = post_index.find(skey);
    // eosio_assert(post != post_index.end(), "Post could not be found");

    // // check if authorized to update post
    // require_auth(post->author);
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
    string employer;
    string title;
    string desc;
    uint64_t maxpriceeos;

    // primary key
    uint64_t primary_key() const { return jobid; }
  };

  typedef eosio::multi_index<name("jobstruct"), jobstruct>
      job_table;

  TABLE bidstruct
  {
    uint64_t bidid;
    uint64_t jobid;
    string developer;
    uint64_t bidpriceeos;
    uint64_t bidtimehours;
    uint64_t bidaccepted;

    // primary key
    uint64_t primary_key() const { return bidid; }
  };

  typedef eosio::multi_index<name("bidstruct"), bidstruct> bid_table;

  TABLE devstruct
  {
    uint64_t devid;
    name devname;
    uint64_t rating;

    // primary key
    uint64_t primary_key() const { return devid; }
  };

  typedef eosio::multi_index<name("devstruct"), devstruct> developer_table;

  TABLE employstruct
  {
    uint64_t empid;
    name empname;
    uint64_t rating;

    // primary key
    uint64_t primary_key() const { return empid; }
  };

  typedef eosio::multi_index<name("employstruct"), employstruct> employer_table;

  job_table _jobs;
  bid_table _bids;
  developer_table _devs;
  employer_table _emps;
};

EOSIO_DISPATCH(collab, (emppostjob)(devbidjob)(empacceptbid)(empmsgdev)(devmsgemp)(devsetjobdone)(empsetjobdone)(empraisearb)(devraisearb)(assignarb)(arbsetresult))
// (empgetbids)