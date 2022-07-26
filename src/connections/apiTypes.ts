export type Publisher = {
    name: string,
    site: string
}

export type ClaimReview = {
    publisher: Publisher,
    url: string,
    title: string,
    reviewDate: string,
    textualRating: string,
    languageCode: string
};

export type ApiClaim = {
    text: string,
    claimant: string,
    claimDate: string,
    claimReview: ClaimReview[]
};

export type ApiResponse = {
    claims: ApiClaim[],
    nextPageToken: string
};

export type StoreClaim = {
    "claim_id": string,
    "claim_org": string,
    "claim_text": string,
    "claim_url": string,
    "text": string,
    "publication": string,
    "publication_date": string
};