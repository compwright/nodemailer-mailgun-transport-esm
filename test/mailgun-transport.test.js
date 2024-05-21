/* eslint-env jest */
import assert from 'node:assert';
import { test } from '@jest/globals';
import MailgunTransport from '../src/index';

test('should send a mail', function (done) {
  // assert.plan(3);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    cc: 'cc@bar.com',
    bcc: 'bcc@bar.com',
    subject: 'Subject',
    text: 'Hello',
    html: '<b>Hello</b>',
    attachment: [],
    'o:tag': 'Tag',
    'o:campaign': 'Campaign',
    'o:dkim': 'yes',
    'o:deliverytime': 'Thu, 13 Oct 2011 18:02:00 GMT',
    'o:testmode': 'yes',
    'o:tracking': 'yes',
    'o:tracking-clicks': 'yes',
    'o:tracking-opens': 'yes',
    'o:require-tls': 'yes',
    'o:skip-verification': 'yes',
    'h:Reply-To': 'reply@bar.com',
    'v:foo': 'bar'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'from@bar.com',
      to: 'to@bar.com',
      cc: 'cc@bar.com',
      bcc: 'bcc@bar.com',
      subject: 'Subject',
      text: 'Hello',
      html: '<b>Hello</b>',
      attachment: [],
      'o:tag': 'Tag',
      'o:campaign': 'Campaign',
      'o:dkim': 'yes',
      'o:deliverytime': 'Thu, 13 Oct 2011 18:02:00 GMT',
      'o:testmode': 'yes',
      'o:tracking': 'yes',
      'o:tracking-clicks': 'yes',
      'o:tracking-opens': 'yes',
      'o:require-tls': 'yes',
      'o:skip-verification': 'yes',
      'h:Reply-To': 'reply@bar.com',
      'v:foo': 'bar'
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should convert attachments to Mailgun format', function (done) {
  // assert.plan(6);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    subject: 'Subject',
    text: 'Hello',
    attachments: [
      {
        path: '/',
        filename: 'CONTRIBUTORS.md',
        contentType: 'text/markdown',
        knownLength: 122
      }
    ]
  };
  const mailgunStub = async result => {
    const { attachment = [] } = result;
    assert.strictEqual(attachment[0].data, '/');
    assert.strictEqual(attachment[0].filename, 'CONTRIBUTORS.md');
    assert.strictEqual(attachment[0].contentType, 'text/markdown');
    assert.strictEqual(attachment[0].knownLength, 122);
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should convert inline attachments to Mailgun format', function (done) {
  // assert.plan(6);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    subject: 'Subject',
    text: 'Hello',
    attachments: [
      {
        cid: 'logo.png',
        content: 'aGVsbG8gd29ybGQh',
        encoding: 'base64'
      }
    ]
  };
  const mailgunStub = async result => {
    const { inline = [] } = result;
    assert.strictEqual(inline[0].data.toString(), 'hello world!');
    assert.strictEqual(inline[0].filename, 'logo.png');
    assert.strictEqual(inline[0].contentType, undefined);
    assert.strictEqual(inline[0].knownLength, undefined);
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should allow using array to assign multiple receiver', function (done) {
  // assert.plan(3);
  const data = {
    from: 'from@bar.com',
    to: ['to@bar.com', 'to1@bar.com'],
    subject: 'Subject',
    text: 'Hello',
    html: '<b>Hello</b>'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'from@bar.com',
      to: 'to@bar.com,to1@bar.com',
      subject: 'Subject',
      text: 'Hello',
      html: '<b>Hello</b>'
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should filter out the invalid data', function (done) {
  // assert.plan(3);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    subject: 'Subject',
    text: 'Hello',
    foo: 'bar'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'from@bar.com',
      to: 'to@bar.com',
      subject: 'Subject',
      text: 'Hello'
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should render a template with variables and send the data as HTML', function (done) {
  // assert.plan(3);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    subject: 'Subject',
    template: {
      name: './test/test_template.hbs',
      engine: 'handlebars',
      context: {
        variable1: 'Passed!'
      }
    },
    foo: 'bar'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'from@bar.com',
      to: 'to@bar.com',
      subject: 'Subject',
      html: '<body><h1>Passed!</h1></body>'
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should pass the template variables and template to mailgun for mailgun to process', function (done) {
  // assert.plan(3);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    subject: 'Subject',
    template: 'boss_door',
    'h:X-Mailgun-Variables': JSON.stringify({ key: 'boss' }),
    foo: 'bar'
  };
  const mailgunStub = async result => {
    assert.deepEqual(result, {
      from: 'from@bar.com',
      to: 'to@bar.com',
      subject: 'Subject',
      template: 'boss_door',
      'h:X-Mailgun-Variables': JSON.stringify({ key: 'boss' })
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should convert to standard address format', function (done) {
  // assert.plan(3);
  const data = {
    from: { name: 'From', address: 'from@bar.com' },
    to: { name: 'To', address: 'to@bar.com' },
    cc: { name: 'Cc', address: 'cc@bar.com' },
    bcc: { name: 'Bcc', address: 'bcc@bar.com' },
    subject: 'Subject',
    text: 'Hello'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'From <from@bar.com>',
      to: 'To <to@bar.com>',
      cc: 'Cc <cc@bar.com>',
      bcc: 'Bcc <bcc@bar.com>',
      subject: 'Subject',
      text: 'Hello'
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should convert to standard address format with broken data and multiple addresses', function (done) {
  // assert.plan(3);
  const data = {
    from: { name: null, address: 'from@bar.com' },
    to: [
      { name: 'To', address: 'to@bar.com' },
      { name: null, address: 'to2@bar.com' },
      { address: 'to3@bar.com' },
      { name: undefined, address: undefined }
    ],
    cc: [
      { name: 'Cc', address: 'cc@bar.com' },
      { name: null, address: 'cc2@bar.com' },
      { address: 'cc3@bar.com' },
      { name: '', address: '' }
    ],
    bcc: [
      { name: 'Bcc', address: 'bcc@bar.com' },
      { name: null, address: 'bcc2@bar.com' },
      { address: 'bcc3@bar.com' },
      { name: 'Bcc4' }
    ],
    replyTo: { name: 'ReplyTo', address: 'replyto@bar.com' },
    subject: 'Subject',
    text: 'Hello'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'from@bar.com',
      to: 'To <to@bar.com>,to2@bar.com,to3@bar.com',
      cc: 'Cc <cc@bar.com>,cc2@bar.com,cc3@bar.com',
      bcc: 'Bcc <bcc@bar.com>,bcc2@bar.com,bcc3@bar.com',
      'h:Reply-To': 'ReplyTo <replyto@bar.com>',
      subject: 'Subject',
      text: 'Hello'
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should transform fields like h:Reply-To', function (done) {
  // assert.plan(3);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    replyTo: 'replyto@bar.com',
    subject: 'Subject',
    text: 'Hello'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'from@bar.com',
      to: 'to@bar.com',
      'h:Reply-To': 'replyto@bar.com',
      subject: 'Subject',
      text: 'Hello'
    });
    return {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<20111114174239.25659.5817@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should allow custom message-id', function (done) {
  // assert.plan(3);
  const data = {
    from: 'from@bar.com',
    to: 'to@bar.com',
    subject: 'Subject',
    text: 'Hello',
    messageId: '<9e5cb9a0-852d-405c-8062-61886814e64c@samples.mailgun.org>'
  };
  const mailgunStub = async result => {
    assert.deepStrictEqual(result, {
      from: 'from@bar.com',
      to: 'to@bar.com',
      subject: 'Subject',
      text: 'Hello',
      'h:Message-Id': '<9e5cb9a0-852d-405c-8062-61886814e64c@samples.mailgun.org>'
    });
    return {
      id: '<9e5cb9a0-852d-405c-8062-61886814e64c@samples.mailgun.org>',
      message: 'Queued. Thank you.'
    };
  };
  const callback = (error, result) => {
    if (error) {
      done(error);
      return;
    }
    assert.strictEqual(
      result.messageId,
      '<9e5cb9a0-852d-405c-8062-61886814e64c@samples.mailgun.org>'
    );
    done();
  };
  MailgunTransport._send(mailgunStub)({ data }, callback);
});

test('should allow custom url with host', function () {
  const transport = MailgunTransport({
    auth: {
      apiKey: 'api-key'
    },
    host: 'api.mailgun.com'
  });
  assert.strictEqual(transport.messages.request.url, 'https://api.mailgun.com/');
});

test('should allow custom url with all fields', function () {
  const transport = MailgunTransport({
    auth: {
      apiKey: 'api-key'
    },
    host: 'api.mailgun.com',
    protocol: 'http:',
    port: 8080
  });
  assert.strictEqual(transport.messages.request.url, 'http://api.mailgun.com:8080/');
});

test('should allow custom url with url field', function () {
  const transport = MailgunTransport({
    auth: {
      apiKey: 'api-key'
    },
    url: 'http://api.mailgun.com:8080'
  });
  assert.strictEqual(transport.messages.request.url, 'http://api.mailgun.com:8080');
});
