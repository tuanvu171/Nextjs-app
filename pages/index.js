import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";
import { Fragment } from "react";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A first Meetup",
//     image:
//       "https://www.theclickcommunity.com/blog/wp-content/uploads/2017/10/Sharrisa-Marie.jpg",
//     address: "Some address 5, 12345 Some City",
//     description: "This is a first meetup!",
//   },
//   {
//     id: "m2",
//     title: "A second Meetup",
//     image:
//       "https://www.theclickcommunity.com/blog/wp-content/uploads/2017/10/Sharrisa-Marie.jpg",
//     address: "Some address 10, 2323 Some City",
//     description: "This is a second meetup!",
//   },
// ];

function HomePage(props) {
  // const [loadedMeetups, setLoadedMeetups] = useState([]);

  // useEffect(() => {
  //   // send a http request and fetch data

  //   // set meetups
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// the page is re-generated for every upcoming request
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// this function is called before the main function
// this is to prepare props for the main function
export async function getStaticProps() {
  // fetch data from API, file system or database
  const client = await MongoClient.connect(
    "mongodb+srv://tuanvu171:tuanvu123@cluster0.qz2xe.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();

  // a collection includes multiple documents
  const meetupsCollection = db.collection("meetups"); // argument is the name of db

  const meetups = await meetupsCollection.find().toArray(); // find all documents

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },

    revalidate: 1, // page is updated every x second for data changes
  };
}

export default HomePage;
