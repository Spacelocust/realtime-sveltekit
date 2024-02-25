import { optional, picklist, string } from 'valibot';

import { GameStatus } from '$shared/enums/lobby';

export const LobbyFilterNameSchema = optional(string());
export const LobbyFilterStatusSchema = optional(
  picklist([GameStatus.Waiting, GameStatus.InProgress]),
);
export const LobbyFilterQuizIdSchema = optional(string());
