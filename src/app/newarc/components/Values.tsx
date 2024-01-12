import Container from "@/components/Container";
import classNames from "@/utils/ClassNames";

export default function Values({values}: Readonly<{
    values: {
        name: string
        description: string
    }[]
}>) {
    return <Container className="xl:px-0 py-24" parentClassName="w-full bg-reef">
        <div className="space-y-2">
            <h2
                className={classNames(
                    "font-sans",
                    'text-4xl max-w-xl lg:max-w-7xl mx-auto font-bold leading-none tracking-tight text-bermuda text-left',
                )}
            >
                Why Choose
                Us?
            </h2>
            <h2 className="text-base font-semibold leading-7 text-zinc-600 text-left">We guide you through your toughest academic task.</h2>
        </div>
        <dl className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
                <div key={value.name}>
                    <dt className="font-semibold text-gray-900 text-left">{value.name}</dt>
                    <dd className="mt-1 text-gray-600 text-left">{value.description}</dd>
                </div>
            ))}
        </dl>
    </Container>
}