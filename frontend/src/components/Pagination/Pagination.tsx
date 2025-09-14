import "./pagination.scss";
import Button from "../Button/Button";
import type React from "react";

interface PaginationProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    league_id?: number;
    leagueListingsLenght?: number;
    filteredListingsLength?: number;
    itemsPerPage: number;
    profileListingsLenght?: number;
    type: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    setCurrentPage,
    league_id,
    leagueListingsLenght,
    filteredListingsLength,
    itemsPerPage = 5,
    profileListingsLenght,
    type,
}) => {
    return (
        <>
            <Button label="<<" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style="secondary" />

            <Button
                label="<"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style="primary"
            />
            {type === "tracks" && (
                <>
                    <p>
                        Page {currentPage} of{" "}
                        {Math.ceil(
                            (league_id !== undefined ? leagueListingsLenght! : filteredListingsLength!) / itemsPerPage
                        )}
                    </p>

                    <Button
                        label=">"
                        onClick={() => {
                            const totalPages = Math.ceil(
                                (league_id !== undefined ? leagueListingsLenght! : filteredListingsLength!) /
                                    itemsPerPage
                            );
                            setCurrentPage((p) => Math.min(p + 1, totalPages));
                        }}
                        disabled={
                            currentPage ===
                            Math.ceil(
                                (league_id !== undefined ? leagueListingsLenght! : filteredListingsLength!) /
                                    itemsPerPage
                            )
                        }
                        style="primary"
                    />

                    <Button
                        label=">>"
                        onClick={() => {
                            const totalPages = Math.ceil(
                                (league_id !== undefined ? leagueListingsLenght! : filteredListingsLength!) /
                                    itemsPerPage
                            );
                            setCurrentPage(totalPages);
                        }}
                        disabled={
                            currentPage ===
                            Math.ceil(
                                (league_id !== undefined ? leagueListingsLenght! : filteredListingsLength!) /
                                    itemsPerPage
                            )
                        }
                        style="secondary"
                    />
                </>
            )}
            {type === "profile" && (
                <>
                    <p>
                        Page {currentPage} of {Math.ceil(profileListingsLenght! / itemsPerPage)}
                    </p>

                    <Button
                        label=">"
                        onClick={() => {
                            const totalPages = Math.ceil(profileListingsLenght! / itemsPerPage);
                            setCurrentPage((p) => Math.min(p + 1, totalPages));
                        }}
                        disabled={currentPage === Math.ceil(profileListingsLenght! / itemsPerPage)}
                        style="primary"
                    />

                    <Button
                        label=">>"
                        onClick={() => {
                            const totalPages = Math.ceil(profileListingsLenght! / itemsPerPage);
                            setCurrentPage(totalPages);
                        }}
                        disabled={currentPage === Math.ceil(profileListingsLenght! / itemsPerPage)}
                        style="secondary"
                    />
                </>
            )}
        </>
    );
};

export default Pagination;
