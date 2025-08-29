import { FC, Fragment } from "react";

interface Props {
    amountOfItems?: number;
}

const MockedContent: FC<Props> = ({ amountOfItems }) => {
    const arr = Array.from(Array(amountOfItems || 100).keys());

    return (
        <Fragment>
            {arr.map((item: number, i: number) => (
                <p
                    key={"mocked-content" + i + "-" + item}
                    data-testid={"mocked-content-" + i}
                    className="py-6"
                >
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Minima eos hic iusto quo porro, reprehenderit eligendi ab
                    ipsum dolorum eaque et placeat animi cumque nostrum nobis
                    error atque exercitationem beatae.
                </p>
            ))}
        </Fragment>
    );
};

export default MockedContent;
