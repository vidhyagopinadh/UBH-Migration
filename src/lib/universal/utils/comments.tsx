const DEFAULT_COMMENT = "DEFAULT_COMMENT";
const CACTUS_COMMENT = "CACTUS_COMMENT";

export const isCommentProviderIsDefaultComment =
import.meta.env.VITE_COMMENTS_PROVIDER === DEFAULT_COMMENT;

export const isCommentProviderIsCactusComment =
import.meta.env.VITE_COMMENTS_PROVIDER === CACTUS_COMMENT;
