export function getNameInitials(name: string) {
	let namePieces = name.trim().split(' ');
	if (namePieces.length === 1) {
		return name.slice(0, 2);
	} else {
		let initials = namePieces[0].at(0)! + namePieces[1].at(0)!;
		return initials;
	}
}
