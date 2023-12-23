interface NewLineProps {
    numberOfLines?: number;
}
export const NewLine = ({ numberOfLines = 2 }: NewLineProps) => {
    return <>{Array(numberOfLines).fill("\n").join("")}</>;
};
