using System;
namespace Sb.Api.Models
{
	public record CreateModuleRequest(
		Guid BoatId,
		string Name,
		string Description,
		bool AllowMultipleVotes = false,
		bool AnonymousVoting = false,
		DateTime? VotingDeadline = null);

	public record VoteForModuleOptionRequest(
		Guid OptionId);

	public record UnVoteModuleOptionRequest(
		Guid OptionId);
}

