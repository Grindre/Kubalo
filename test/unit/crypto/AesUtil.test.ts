
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
			expect( typeof AesBase64Decrypted ).toBe( 'string' );
			expect( AesBase64Encrypted.length ).toBeGreaterThan( 0 );
			expect( AesBase64Encrypted.length ).toBeGreaterThan( 0 );
			expect( AesBase64Encrypted.length ).toBeGreaterThan( AesBase64Decrypted.length );
			expect( AesBase64Decrypted ).toBe( message );

			//	AesHex
			const AesHexEncrypted : string = AesHex.encryptAES( message, aliceSharedSecret );
			const AesHexDecrypted : string = AesHex.decryptAES( AesHexEncrypted, aliceSharedSecret );
			console.log( `encrypted :`, AesHexEncrypted );
			console.log( `decrypted :`, AesHexDecrypted );
			expect( typeof AesHexEncrypted ).toBe( 'string' );
			expect( typeof AesHexDecrypted ).toBe( 'string' );
			expect( AesHexEncrypted.length ).toBeGreaterThan( 0 );
			expect( AesHexEncrypted.length ).toBeGreaterThan( 0 );
			expect( AesHexEncrypted.length ).toBeGreaterThan( AesHexDecrypted.length );
			expect( AesHexDecrypted ).toBe( message );




// 			const password = `my-password`;
// 			//const key = forge.random.getBytesSync( 16 );
// 			//const iv = forge.random.getBytesSync( 16 );
// 			const key = AesUtil.calcAesKey( password );
// 			const iv = AesUtil.calcAesIv( password );
//
// 			const someBytes = forge.util.createBuffer( message, 'utf8' );
//
// 			// encrypt some bytes using CBC mode
// 			// (other modes include: ECB, CFB, OFB, CTR, and GCM)
// 			// Note: CBC and ECB modes use PKCS#7 padding as default
// 			const cipher = forge.cipher.createCipher( 'AES-CBC', key );
// 			cipher.start( { iv : iv } );
// 			cipher.update( forge.util.createBuffer( someBytes ) );
// 			cipher.finish();
// 			const encrypted = cipher.output;
// 			//const encryptedBytes = _.clone( encrypted.getBytes() );
// 			//const encryptedBase64 = forge.util.encode64( encrypted.getBytes() );
// 			//const encryptedBase64 = btoa( encrypted.getBytes() );
// 			//console.log( `encryptedBase64 :`, encryptedBase64 );
//
// 			// outputs encrypted hex
// 			const encryptedHex = encrypted.toHex();
// 			console.log( `encrypted.toHex() :`, encryptedHex );
//
//
// 			// 将十六进制字符串转换为字节数组
// 			const byteArray = forge.util.hexToBytes(encryptedHex);
//
// // 创建 ByteStringBuffer 对象
// 			const byteStringBuffer = forge.util.createBuffer(byteArray);
// // decrypt some bytes using CBC mode
// // (other modes include: CFB, OFB, CTR, and GCM)
// 			const decipher = forge.cipher.createDecipher( 'AES-CBC', key );
// 			decipher.start( { iv : iv } );
// 			decipher.update( byteStringBuffer );
// 			const result = decipher.finish(); // check 'result' for true/false
//