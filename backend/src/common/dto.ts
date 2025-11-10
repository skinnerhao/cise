export type SubmissionDto = {
  title: string;
  authors: string;
  doi?: string;
  url?: string;
};

export type EvidenceDto = {
  practice: string;
  claim: string;
  result: string; // 支持/不支持/混合 等
  studyType: string;
};