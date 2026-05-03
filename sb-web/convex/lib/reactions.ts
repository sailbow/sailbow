import { components } from "../_generated/api";
import { Reactions } from "../components/reactions/client";
import type { ComponentApi } from "../components/reactions/component/_generated/component";

const reactions = new Reactions(components.reactions as ComponentApi);
export default reactions;
