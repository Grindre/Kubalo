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
	 *	@param object		{any}
	 *	@param password		{string}
	 *	@returns {Promise<string>}
	 */
	public encryptFromObject( object : any, password : string ) : Promise<string>
	{
		return new Promise( ( resolve, reject) =>
		{
			try
			{
				const jsonString : string = JSON.stringify( object );
				resolve( this.encrypt( jsonString, password ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param encryptedText	{string}
	 *	@param password		{string}
	 *	@returns {Promise<*>}
	 */
	public decryptToObject<T>( encryptedText : string, password : string ) : P