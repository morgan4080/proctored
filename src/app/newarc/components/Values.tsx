export default function Values({values}: {values: {
        name: string
        description: string
    }[]}) {
    return <div className="mx-auto my-24 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center font-sans">Why Choose Us</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
                We guide you through your toughest academic task.
            </p>
        </div>
        <dl className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
                <div key={value.name}>
                    <dt className="font-semibold text-gray-900 text-center">{value.name}</dt>
                    <dd className="mt-1 text-gray-600 text-center">{value.description}</dd>
                </div>
            ))}
        </dl>
    </div>
}