import { db } from "@/db";
import auth from "../app/middleware";
import { revalidatePath } from "next/cache";
import { VoteButton } from "./VoteButton";
import { LoginButton } from "./LoginButton";



export async function Vote({ postId, votes }) {
  const session = await auth();

  async function upvote() {
    "use server";
    const session = await auth();

    
    console.log("Downvote", postId, "by user", session.user.id);
    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
      [session.user.id, postId, 1, "post"]
    );

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
    }
    // }

  async function downvote() {
    "use server";
    const session = await auth();

    console.log("Downvote", postId, "by user", session.user.id);
    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
      [session.user.id, postId, -1, "post"]
    );

    revalidatePath("/");
    revalidatePath(`/post/${postId}`); 


    }

    if (!session) {
      return (
        <div className="max-w-screen-lg mx-auto p-4 mt-10">
          You need to login to upvote/downvote a post <LoginButton />
        </div>
      );
    }
  



  return (
    <>
      {votes} votes
      <div className="flex space-x-3">
        <form action={upvote} disabled={votes.vote === 1}>
          <VoteButton label="Upvote" />
        </form>
        <form action={downvote} disabled={votes.vote === 0}>
          <VoteButton label="Downvote" />
        </form>
      </div>
    </>
  );
}

