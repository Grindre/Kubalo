import _ from "lodash";
import { AesHex } from "./AesHex";

/**
 * 	@class
 */
export class AesCrypto
{
	passwordPrefix : string = `debeem_password_`;

	constructor( passwordPrefix ?: string )
	{
		if ( _.isString( passwordPrefix ) && ! _.isEmpty( passwordPrefix ) )
		{
			this.passwordPrefix = passwordPrefix;
		}
	}

	/**
	 *	@param ob