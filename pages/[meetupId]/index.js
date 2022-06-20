import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

// knows which Ids are avaiable and should be pre-generated
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://tuanvu171:tuanvu123@cluster0.qz2xe.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();

  // a collection includes multiple documents
  const meetupsCollection = db.collection("meetups"); // argument is the name of db

  // find({filter},{which fields})
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); // contain only the id

  client.close();

  return {
    // whether your path arrays include all or just some of params
    // false: already include all, if user request others --> return 404
    // true: not include all, dynamic
    // "blocking"
    fallback: "blocking",

    // paths: [
    //   // normally fetch from database or API
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],

    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  // react hooks cannot be used in this function, but only in main function

  const meetupId = context.params.meetupId; // between the square brackets of folder [meetupId]

  const client = await MongoClient.connect(
    "mongodb+srv://tuanvu171:tuanvu123@cluster0.qz2xe.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();

  // a collection includes multiple documents
  const meetupsCollection = db.collection("meetups"); // argument is the name of db

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
