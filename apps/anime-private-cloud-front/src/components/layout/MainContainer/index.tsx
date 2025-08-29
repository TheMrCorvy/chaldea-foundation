import { FC, ReactElement } from "react";

interface Props {
    children: ReactElement;
}

const MainContainer: FC<Props> = ({ children }) => {
    return (
        <article
            data-testid="main-container"
            className="mx-2 sm:mx-6 md:mx-8 lg:mx-12 max-w-[175rem] mt-12 mb-12 p-6 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 flex flex-row relative gap-6 min-h-[80vh] justify-center"
        >
            {children}
        </article>
    );
};

export default MainContainer;
