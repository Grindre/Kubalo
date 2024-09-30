
import { describe, expect } from '@jest/globals';
import * as forge from 'node-forge';
import { ethers, isHexString } from "ethers";
import { AesHex } from "../../../src";
import { AesBase64 } from "../../../src";

/**
 *	unit test
 */
describe( "AesUtil", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Test encryptAES and decryptAES", () =>
	{
		it( "should test utf8", () =>
		{
			const message = `UTF8测试bob，你是alice吗？`;
			const encodedUtf8 = forge.util.encodeUtf8( message );
			const decodedUtf8 = forge.util.decodeUtf8( encodedUtf8 );
			// console.log( `encodedUtf8 :`, encodedUtf8 );
			// console.log( `decodedUtf8 :`, decodedUtf8 );

			const utf8Buffer = forge.util.createBuffer( forge.util.encodeUtf8( message ), 'utf8' );
			const bufferBase64 = forge.util.encode64( utf8Buffer.getBytes() );

			const decoded2Buffer = forge.util.createBuffer( forge.util.decode64( bufferBase64 ) );
			const decoded2Utf8 = forge.util.decodeUtf8( decoded2Buffer.toString() );
			//console.log( `decoded2Utf8 :`, decoded2Utf8 );
		});

		it( "should encrypt and decrypt message by ECDH shared secret", () =>
		{
			const alicePrivateKey = `0x2f2b8e6b059254fa4709898eb82cb0b372e24acc94329000d6887c140e9b4f22`;
			const alicePublicKey = `0x0388447f78493804b3d885988d6a81b5e1a2b6c9496d314ae7e6c5efd376c7adea`;

			const bobPrivateKey = `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a`;
			const bobPublicKey = `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622`;

			expect( isHexString( alicePrivateKey, 32 ) ).toBeTruthy();
			expect( isHexString( bobPrivateKey, 32 ) ).toBeTruthy();

			const aliceKey = new ethers.SigningKey( alicePrivateKey );
			const bobKey = new ethers.SigningKey( bobPrivateKey );

			const aliceSharedSecret = aliceKey.computeSharedSecret( bobPublicKey );
			const bobSharedSecret = bobKey.computeSharedSecret( alicePublicKey );

			// console.log( `ethers :: aliceSharedSecret :`, aliceSharedSecret );
			// console.log( `ethers :: bobSharedSecret :`, bobSharedSecret );
			expect( aliceSharedSecret ).toBeDefined();
			expect( bobSharedSecret ).toBeDefined();
			expect( 'string' === typeof aliceSharedSecret ).toBeTruthy();
			expect( 'string' === typeof bobSharedSecret ).toBeTruthy();
			expect( aliceSharedSecret.length ).toBeGreaterThanOrEqual( 0 );
			expect( bobSharedSecret.length ).toBeGreaterThanOrEqual( 0 );
			expect( aliceSharedSecret ).toBe( bobSharedSecret );


			const message = `我是Bob，你是Alice吗？`;

			//	AesBase64
			const AesBase64Encrypted : string = AesBase64.encryptAES( message, aliceSharedSecret );
			const AesBase64Decrypted : string = AesBase64.decryptAES( AesBase64Encrypted, aliceSharedSecret );
			console.log( `encrypted :`, AesBase64Encrypted );
			console.log( `decrypted :`, AesBase64Decrypted );
			expect( typeof AesBase64Encrypted ).toBe( 'string' );