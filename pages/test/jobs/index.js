import Head from 'next/head';
import Card from '../../../components/card';
import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';

export default function Home({ data }) {
  const [filteredJobs, setFilteredJobs] = useState(data.jobs);
  const [filteredByDate, setFilteredByDate] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [distinctCompanies, setDistinctCompanies] = useState([]);

  const [alphabeticalFilter, setAlphabeticalFilter] = useState(false);

  // orders companies alphabetically
  const handleFilterAlphabetically = (e) => {
    //if unordered, or sorted descending, sort ascending
    if (alphabeticalFilter === false || alphabeticalFilter === 'DESC') {
      setAlphabeticalFilter('ASC');
      filteredJobs.sort((a, b) => a.companyName.localeCompare(b.companyName));
    }

    //if sorted ascending, sort descending
    if (alphabeticalFilter === 'ASC') {
      setAlphabeticalFilter('DESC');
      filteredJobs.sort((a, b) => b.companyName.localeCompare(a.companyName));
    }
  };

  //handler function called when user filters by company
  const handleFilterByCompanyName = (e) => {
    const { value } = e.target;
    setSelectedCompany(value);

    //if user selects 'All' and filters by date is off, show all jobs
    if (value === 'All' && !filteredByDate) return setFilteredJobs(data.jobs);

    //if user selects 'All' and filters by date is on, show all jobs that were posted within last week
    if (value === 'All' && filteredByDate)
      return setFilteredJobs(filterByDate(data.jobs));

    //if user selects a company and filters by date is on, show all jobs for that company that were posted within last week
    if (value != 'All' && filteredByDate) {
      const filtered = filterByCompanyName(value);
      filtered = filterByDate(filtered);
      return setFilteredJobs(filtered);
    }

    //if user selects a company and filters by date is off, show all jobs for that company
    setFilteredJobs(filterByCompanyName(value));
  };

  //function that filters jobs by company name, returns filtered array
  const filterByCompanyName = (name) => {
    const filter = data.jobs.filter((job) => {
      return job.companyName === name;
    });
    return filter;
  };

  //handler function called when user filters by date
  const handleFilterByDate = () => {
    setFilteredByDate(!filteredByDate);

    // filter by date has just been turned off and no company selected, show all jobs
    if (filteredByDate && selectedCompany === 'All')
      return setFilteredJobs(data.jobs);

    // filter by date has just been turned off and company selected, show all jobs for that company
    if (filteredByDate && selectedCompany !== 'All')
      return setFilteredJobs(filterByCompanyName(selectedCompany));

    // filter by date has just been turned on, show all jobs that were posted within last week
    // no check for selected company since filteredJobs will either have all jobs or only contain jobs by selected company
    setFilteredJobs(filterByDate(filteredJobs));
  };

  // function that filters jobs by date, returns filtered array
  const filterByDate = (jobs) => {
    const today = new Date();
    const filter = jobs.filter((job) => compareDates(today, job));

    return filter;
  };

  // helper function used in filterByDate, returns true if job was posted within last week
  const compareDates = (today, job) => {
    const datePosted = new Date(job.postingDate);
    const difference = Math.abs(today - datePosted) / 1000 / 60 / 60 / 24;

    return difference >= 7 ? job : null;
  };

  //runs only when component first loads, filters all job postings to find distinct companies and sets distinctCompanies state
  useEffect(() => {
    let companies = data.jobs.map((job) => job.companyName);
    companies = [...new Set(companies)];
    setDistinctCompanies(companies);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Zippia Test</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {data.title.toUpperCase()} JOBS NEAR ME -{' '}
          {data.totalJobs.toLocaleString('en-US')} JOBS
        </h1>

        <div className={styles['buttons-container']}>
          <button
            className={styles['filter-button']}
            value='date'
            onClick={handleFilterAlphabetically}
          >
            Order by company
            {alphabeticalFilter && (
              <img
                src='/static/img/expand_more.svg'
                className={[
                  styles['sort-arrow'],
                  alphabeticalFilter === 'DESC' ? styles['descending'] : '',
                ].join(' ')}
                alt='sort arrow'
              />
            )}
          </button>
          <select
            className={styles['filter-button']}
            value={selectedCompany}
            onChange={handleFilterByCompanyName}
          >
            <option value='All'>All</option>
            {distinctCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          <button
            className={[
              styles['filter-button'],
              filteredByDate ? styles['active-filter-button'] : '',
            ].join(' ')}
            value='date'
            onClick={handleFilterByDate}
          >
            Past Week
          </button>
        </div>

        <div className={styles.grid}>
          {/* loop through first 10 filteredJobs and render each job as a Card */}
          {filteredJobs.slice(0, 10).map((job, index) => (
            <Card
              key={index}
              logo={job.companyLogo}
              title={job.jobTitle}
              company={job.companyName}
              description={job.jobDescription
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 345)
                .concat('...')}
              rating={job.companyZippiaOverallScore}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

//Using server Side rendering to fetch data from the API, and then passing it to the component as props
export const getServerSideProps = async () => {
  const jobTitle = 'Business Analyst';
  // Fetch data from external API
  const res = await fetch(`https://www.zippia.com/api/jobs/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      companySkills: true,
      dismissedListingHashes: [],
      fetchJobDesc: true,
      jobTitle,
      locations: [],
      numJobs: 20,
      previousListingHashes: [],
    }),
  });
  const data = await res.json();

  //Adding the job title to the data object so it can be displayed on the page
  data.title = jobTitle;

  // Pass data to the page via props
  return { props: { data } };
};
