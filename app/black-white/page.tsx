import {kv} from "@vercel/kv";
import {Poll} from "@/app/types";
import {PollVoteForm} from "@/app/form";
import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";

const fixed_Id = "f14d223d-8c0c-49a9-a998-3d72ffe27537"
async function getPoll(id: string): Promise<Poll> {
    let nullPoll = {
        id: "",
        title: "No poll found",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        votes1: 0,
        votes2: 0,
        votes3: 0,
        votes4: 0,
        created_at: 0,
    };

    try {
        let poll: Poll | null = await kv.hgetall(`poll:${id}`);

        if (!poll) {
            return nullPoll;
        }

        return poll;
    } catch (error) {
        console.error(error);
        return nullPoll;
    }
}

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    let id = fixed_Id
    const poll = await getPoll(id)
    console.log(poll)

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${process.env['HOST']}/api/vote?id=${id}`,
        "fc:frame:image": `${process.env['HOST']}/api/image?id=${id}`,
    };

    fcMetadata[`fc:frame:button:${1}`] = "Black";
    fcMetadata[`fc:frame:button:${2}`] = "White";

    return {
        title: poll.title,
        openGraph: {
            title: poll.title,
            images: [`/api/image?id=${id}`],
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}
function getMeta(
    poll: Poll
) {
    // This didn't work for some reason
    return (
        <Head>
            <meta property="og:image" content="" key="test"></meta>
            <meta property="og:title" content="My page title" key="title"/>
        </Head>
    );
}


export default async function Page({params}: { params: {id: string}}) {
    const id = ""
    const poll = await getPoll(fixed_Id);

    return(
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
                    <PollVoteForm poll={poll}/>
                </main>
            </div>
        </>
    );

}