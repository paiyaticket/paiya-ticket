import { Country } from "./country";

export class UserData{
    id: string | undefined;
	lastname: string | undefined;
	firstname: string | undefined;
	displayname: string | undefined | null;
	email: string | undefined | null;
    photoUrl : string | undefined | null;
    avatarLabel : string | undefined | null;
	gender: string | undefined;
	phoneNumber: string | undefined | null;
	language: string | undefined;
	address: Address | undefined;

}

export class Address{
	country: Country | undefined;
	city: string | undefined;
	state: string | undefined;
	postal: string | undefined;
	addressDetail: string | undefined;
}
