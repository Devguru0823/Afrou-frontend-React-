import React, { Component } from "react";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import DetailSection from "../Home/DetailSection";
import "../Home/Home.css";

class Home extends Component {
  componentDidMount() {
    console.log(this.props);
    if (this.props.location.hash) {
      let offsetTop = document.getElementById(
        this.props.location.hash.replace("#", "")
      ).offsetTop;
      window.scrollTo(0, offsetTop);
    }
  }
  onClickSeeMoreTerms = () => {
    let offsetTop = document.getElementById("terms-5").offsetTop;
    window.scrollTo(0, offsetTop);
  };
  render() {
    return (
      <div>
        <section className="bannerhomepage">
          <div className="container">
            <div className="bannerconts" style={{ padding: "10px" }}>
              <div className="landing-header">
                <h1>Terms and Policies.</h1>
              </div>
              <br />
              <h6>
                Welcome to Afrocamgist!
                <br />
                <br />
                Afrocamgist creates technologies and services that enable people
                to connect with one another, build communities, enhance their
                talent and grow their businesses. These Terms guide your use of
                Afrocamgist, features, apps, services, technologies and software
                that we offer under Afrocamgist ltd. We do not charge you in
                using Afrocamgist and services covered by these Terms. Instead,
                generate resource by businesses and organisations paying us to
                show you ads about their products and services. By using
                Afrocamgist, you agree that we can show you adverts that we
                think will be useful to you and your interests. We use your
                personal data to help tailor this adverts.
                <br />
                <br />
                However, do not sell your personal data to businesses for
                advertisement, and we do not share information which directly
                identifies you (which includes your name, email address or other
                contact information) with advertisers unless you grant us
                specific permission. Moreover, advertisers can provide us things
                such as the kind of audience that they targets to see their ads,
                and we stream those ads to people who it may interest. We made
                provision for advertisers with records about the performance of
                their ads which help them understand how people are interacting
                with their products/services.
                <br />
                <br />
                Our Data Policy explains more how we collect and use your
                personal data to determine the ads that you see and provide all
                of the other services described below.
              </h6>
              <br />
              <h4 id="terms-1">
                <b>1. The services we provide</b>
              </h4>
              <h6>
                Our mission is to create a community for Afro World around the
                globe to connect with each other, create a room for innovation,
                empowerment, connection for product growth, talent discovery and
                empowerment. Therefore, bringing this great community together
                than before: to encourage, empower and grow themselves. However,
                it’s not and shall not tolerate racism of any kind within the
                community or other racial community.
                <br />
                To help achieve this mission, we provide the products and
                services explained below to you:
                <br />
                <br />
                Provide a tailored experience for you:
                <br />
                Your experience on Afrocamgist is unlike anyone else's: from the
                posts, popular post, events, ads and other content that you see
                in timeline or our video platform to the Pages that you follow
                and other features that you might use, such as hashtag, groups
                and search. We use the data that we have – for example, about
                the connections you make, the choices and settings you select,
                and what you share and do on and off our Products – to tailor
                your experience.
                <br />
                <br />
                Connect you with users and personalities and organisations that
                you care about:
                <br />
                We help you trace and connect with people, groups, businesses,
                organisations and others that matter to you across Afrocamgist.
                We use the data that we have to make suggestions for you and
                others – for example, groups to join, events to attend, hashtag
                and Pages to follow or send a message to, shows to watch and
                people who you may want to become friends with. Stronger ties
                make for better communities, and we believe that our services
                are most useful when people are links and connected to people,
                groups and organisations that they care about.
                <br />
                <br />
                Empower you to love yourself and communicate about what matters
                to you:
                <br />
                There are many ways to express yourself on Afrocamgist and to
                commune with friends, colleagues and compatriot across the
                globe– for example, sharing status updates, photos, videos and
                stories across the Afrocamgist Products that you use, sending
                messages to followings only, creating groups, or adding interest
                to your profile. We have also created, and shall continue
                innovate on ways this community can showcase their diverse
                cultures and talent, and new ways to use technology. <br />
                <br />
                Help you explore content, our products and services that may
                interest you:
                <br />
                We show you ads, and other promoted content to enable you
                discover content, products and services that are offered by the
                many businesses and organisations that use Afrocamgist and other
                Afrocamgist services. Section 2 below explains this in more
                detail.
                <br />
                <br />
                Harmful conduct are combat, to protect and support our
                community:
                <br />
                People will build community on Afrocagist if they feel safe. We
                deploys a dedicated teams around the world with technical
                systems to detect misuse of our Products, harmful conduct
                towards others and situations where we may be able to help
                support or protect our community. If we are reported or detect
                such content like this, we will take appropriate action – by
                removing content after immediate investigation, and disabling an
                account or contacting law enforcement if need be. We do not
                share data with any other social media companies for now,
                however, when we detect misuse or harmful conduct shared from
                their platforms we shall as well delete or block the content.{" "}
                <br />
                <br />
                We use and develop advanced technologies to provide safe and
                functional services for everyone:
                <br />
                Afrocamgist use and develop advanced technologies such as
                algorithms, machine learning systems and imitate reality so that
                people can use our Products safely regardless of physical
                infrastructures or geographic locations.
                <br />
                <br />
                Enable global access to our services: <br />
                In order to operate a global service, we uses content network
                delivery that stores and distribute content from the origin
                server centre to the 200 content delivery network around globe
                including outside your country of residence. This infrastructure
                may be operated or controlled by Afrocamgist ltd, or its
                affiliates.
              </h6>
              <br />
              <h4 id="terms-2">
                <b>2. How our services are funded</b>
              </h4>
              <h6>
                Instead of paying to use Afrocamgist services we offer, by using
                the Afrocamgist Products and services covered by these Terms you
                agree that we can tailor and stream you ads that business and
                organisations pay us to promote on and off the Afrocamgist
                Company Products. We use your personal data, such as information
                about your activity and interests, to show you ads that are more
                relevant to you.
                <br />
                <br />
                Moreover, protecting our user privacy is central to how we've
                designed our ad system. This means that we can show you relevant
                and useful ads without disclosing to advertisers who you are. We
                do not sell your personal data. We allow advertisers to make a
                demand to us things such as their business goal, and the kind of
                audience that they want to see their ads (such as, demography:
                ages of 18-35 who likes entertainment). We then show their ad to
                people who might be interested. We also provide reports about
                the performance of their ads to help them understand how people
                are interacting with their content on and off Afrocamgist. For
                example, we provide general demographic and interest information
                for advertisers (such as, that an ad was seen by a woman between
                the ages of 25 and 34 who lives in Nigeria and likes computer
                engineering) to help them better understand their audience. We
                do not share information that directly identifies.
                <br />
                <br />
                We collect and use your personal data in order to provide the
                services described above for you. Moreover, we comply with EULA
                and Data protection Act 2019.
                <br />
                <div
                  onClick={this.onClickSeeMoreTerms}
                  style={{
                    textAlign: "left",
                    color: "#0056b3",
                    // textDecoration: "underline",
                  }}
                >
                  See More...
                </div>
              </h6>
              <br />

              <h4 id="terms-3">
                <b>3. Your commitments to Afrocamgist community</b>
              </h4>
              <h6>
                We provide these services to you and others to help advance our
                mission. In exchange, we need you to make the following
                commitments:
                <br />
                <br />
                1. Who can use Afrocamgist.
                <br />
                When people stand behind their opinions and actions, our
                community is safer and more accountable. For this reason, you
                must:
                <br />
                <ul className="terms-privacy-list">
                  <li>use the same name that you use in everyday life;</li>
                  <li>provide accurate information about yourself;</li>
                  <li>
                    create only one account (your own) and use your timeline for
                    personal purposes; and
                  </li>
                  <li>
                    not share your password, give access to your Afrocamgist
                    account to others or transfer your account to anyone else
                    (without our permission).
                  </li>
                </ul>
                We try to make Afrocamgist broadly available to everyone, but
                you cannot use Afrocamgist if:
                <ul className="terms-privacy-list">
                  <li>You are under 13 years old.</li>
                  <li>You are a convicted sex offender.</li>
                  <li>
                    We've previously disabled your account for breaches of our
                    Terms or Policies.
                  </li>
                  <li>
                    You are prohibited from receiving our products, services or
                    software under applicable laws.
                  </li>
                </ul>
                <br />
                2. What you can share and do on Afrocamgist
                <br />
                We want people to use Afrocamgist to express themselves and to
                share content that is important to them in relation to the
                mission of Afrocamgist but not at the expense of the safety and
                well-being of others or the integrity of our community and other
                race. You therefore agree not to engage in the conduct described
                below (or to facilitate or support others in doing so):
                <ol className="terms-privacy-list">
                  <li>
                    You may not use our Products to do or share anything:
                    <br />
                    <ul className="terms-privacy-list">
                      <li>
                        That breaches these Terms, our Community Standards and
                        other terms and policies that apply to your use of
                        Afrocamgist.
                      </li>
                      <li>
                        That is unlawful, misleading, discriminatory or
                        fraudulent.
                      </li>
                      <li>
                        That infringes or breaches someone else's rights,
                        including their intellectual property rights.
                      </li>
                    </ul>
                  </li>
                  <li>
                    You may not upload viruses or malicious code, or do anything
                    that could disable, overburden or impair the proper working
                    or appearance of our Products.
                  </li>
                  <li>
                    You may not access or collect data from our Products using
                    automated means (without our prior permission) or attempt to
                    access data that you do not have permission to access.
                  </li>
                </ol>
                We can remove or block content that is in breach of these
                provisions. If we remove content that you have shared for breach
                of our Community Standards, we'll let you know and explain any
                options that you have to request another review, unless you
                seriously or repeatedly breach these Terms or if doing so may
                expose us or others to legal liability; harm our community of
                users; compromise or interfere with the integrity or operation
                of any of our services, systems or Products; where we are
                restricted due to technical limitations; or where we are
                prohibited from doing so for legal reasons.
                <br />
                To help support our community, we encourage you to report
                content or conduct that you believe breaches your rights
                (including intellectual property rights ) or our terms and
                policies.
                <br />
                <br />
                3. The permissions you give us
                <br />
                We need certain permissions from you to provide our services:
                <ol className="terms-privacy-list">
                  <li>
                    <u>Permission to use content that you create and share: </u>
                    Some content that you share or upload, such as photos or
                    videos, may be protected by intellectual property laws.
                    <br />
                    <br />
                    You own the intellectual property rights (things such as
                    copyright or trademarks) in any such content that you create
                    and share on Afrocamgist and the other Afrocamgist Company
                    Products you use. Nothing in these Terms takes away the
                    rights you have to your own content. You are free to share
                    your content with anyone else, wherever you want.
                    <br />
                    <br />
                    However, to provide our services, we need you to give us
                    some legal permissions (known as a ‘licence') to use this
                    content. This is solely for the purposes of providing and
                    improving our Products and services as described in Section
                    1 above.
                    <br />
                    <br />
                    Specifically, when you share, post or upload content that is
                    covered by intellectual property rights on or in connection
                    with our Products, you grant us a non-exclusive,
                    transferable, sub-licensable, royalty-free and worldwide
                    licence to host, use, distribute, modify, run, copy,
                    publicly perform or display, translate and create derivative
                    works of your content (consistent with your privacy and
                    application settings). This means, for example, that if you
                    share a photo on Afrocamgist, you give us permission to
                    store, copy and share it with others (again, consistent with
                    your settings) such as service providers that support our
                    service or other Afrocamgist Products you use.This licence
                    will end when your content is deleted from our systems.
                    <br />
                    <br />
                    You can delete content individually or all at once by
                    deleting your account. Learn more about how to delete your
                    account. You can download a copy of your data at any time
                    before deleting your account.
                    <br />
                    <br />
                    When you delete content, it's no longer visible to other
                    users; however, it may continue to exist elsewhere on our
                    systems where:
                    <ul className="terms-privacy-list">
                      <li>
                        Immediate deletion is not possible due to technical
                        limitations (in which case, your content will be deleted
                        within a maximum 48months of days from when you delete
                        it);
                      </li>
                      <li>
                        your content has been used by others in accordance with
                        this licence and they have not deleted it (in which
                        case, this licence will continue to apply until that
                        content is deleted); or
                      </li>
                      <li>
                        Where immediate deletion would restrict our ability to:
                        <ul className="terms-privacy-list">
                          <li>
                            investigate or identify illegal activity or breaches
                            of our Terms and Policies (for example, to identify
                            or investigate misuse of our Products or systems);
                          </li>{" "}
                          <li>
                            comply with a legal obligation, such as the
                            preservation of evidence; or
                          </li>{" "}
                          <li>
                            comply with a request of a judicial or
                            administrative authority, law enforcement or a
                            government agency;
                          </li>{" "}
                        </ul>
                      </li>
                    </ul>
                    in which case, the content will be retained for no longer
                    than is necessary for the purposes for which it has been
                    retained (the exact duration will vary on a case-by-case
                    basis).
                    <br />
                    In each of the above cases, this licence will continue until
                    the content has been fully deleted.
                  </li>
                  <br />
                  <li>
                    <u>
                      Permission to use your name, profile picture and
                      information about your actions with ads and sponsored
                      content:{" "}
                    </u>{" "}
                    You give us permission to use your name and profile picture
                    and information about actions that you have taken on
                    Afrocamgist next to or in connection with ads, offers and
                    other sponsored content that we display across our Products,
                    without any compensation to you. For example, we may show
                    your friends that you are interested in an advertised event
                    or have liked a Page created by a brand that has paid us to
                    display its ads on Afrocamgist. Ads like this can be seen
                    only by people who have your permission to see the actions
                    that you've taken on Afrocamgist. You can learn more about
                    interest setting
                  </li>
                  <br />
                  <li>
                    <u>
                      Permission to update software that you use or download:{" "}
                    </u>{" "}
                    If you download or use our software, you give us permission
                    to download and install updates to the software where
                    available.
                  </li>
                </ol>
                <br />
                4. Limits on using our intellectual property
                <br />
                If you use content covered by intellectual property rights that
                we have and make available in our Products (for example, images,
                designs, videos or sounds that we provide, which you add to
                content that you create or share on Afrocamgist), we retain all
                rights to that content (but not yours). You can only use our
                copyrights or with our prior written permission. You must obtain
                our written permission (or permission under an open source
                licence) to modify, create derivative works of, decompile or
                otherwise attempt to extract source code from us.
              </h6>
              <br />
              <h4 id="terms-4">
                <b>4. Additional provisions</b>
              </h4>
              <h6>
                <ol className="terms-privacy-list">
                  <li>
                    {" "}
                    Updating our Terms
                    <br />
                    We work constantly to improve our services and develop new
                    features to make our Products better for you and our
                    community. As a result, we may need to update these Terms
                    from time to time to accurately reflect our services and
                    practices. We will only make changes if the provisions are
                    no longer appropriate or if they are incomplete, and only if
                    the changes are reasonable and take due account of your
                    interests.
                    <br />
                    We will notify you (for example, by email or through our
                    Products) at least 30 days before we make changes to these
                    Terms and give you an opportunity to review them before they
                    go into effect, unless the changes are required by law. Once
                    any updated Terms are in effect, you will be bound by them
                    if you continue to use our Products.
                    <br />
                    We hope that you will continue using our Products, but if
                    you do not agree to our updated Terms and no longer want to
                    be part of the Afrocamgist community, you can delete your
                    account at any time.
                  </li>
                  <br />
                  <li>
                    {" "}
                    Account suspension or termination
                    <br />
                    We want Afrocamgist to be a place where people feel welcome
                    and safe to express themselves and share their thoughts,
                    cultures and ideas.
                    <br />
                    If we determine that you have clearly, seriously or
                    repeatedly breached our Terms or Policies, including in
                    particular our Community Standards , we may suspend or
                    permanently disable access to your account. We may also
                    suspend or disable your account if you repeatedly infringe
                    other people's intellectual property rights or where we are
                    required to do so for legal reasons.
                    <br />
                    Where we take such action, we'll let you know and explain
                    any options you have to request a review, unless doing so
                    may expose us or others to legal liability; harm our
                    community of users; compromise or interfere with the
                    integrity or operation of any of our services, systems or
                    Products; where we are restricted due to technical
                    limitations; or where we are prohibited from doing so for
                    legal reasons.
                    <br />
                    You can learn more contact page about what you can do if
                    your account has been disabled and how to contact us if you
                    think that we have disabled your account by mistake.
                    <br />
                    If you delete or we disable your account, these Terms shall
                    terminate as an agreement between you and us, but the
                    following provisions will remain in place: 3.3.1, 4.2-4.5.
                  </li>
                  <br />
                  <li>
                    {" "}
                    Limits on liability
                    <br />
                    Nothing in these Terms is intended to exclude or limit our
                    liability for death, personal injury or fraudulent
                    misrepresentation caused by our negligence, or to affect
                    your statutory rights.
                    <br />
                    We will exercise professional diligence in providing our
                    Products and services to you and in keeping a safe, secure
                    and error-free environment. Provided that we have acted with
                    professional diligence, we do not accept responsibility for
                    losses not caused by our breach of these Terms or otherwise
                    by our acts; losses that are not reasonably foreseeable by
                    you and us at the time of entering into these Terms; and
                    events beyond our reasonable control.
                  </li>
                  <br />
                  <li>
                    Disputes
                    <br />
                    We try to provide clear rules so that we can limit or
                    hopefully avoid disputes between you and us. If a dispute
                    does arise, however, it's useful to know up front where it
                    can be resolved and what laws will apply.
                    <br />
                    If you are a consumer and habitually reside in a Member
                    State of the European Union, the laws of that Member State
                    will apply to any claim, cause of action or dispute that you
                    have against us, which arises out of or relates to these
                    Terms or the Afrocamgist Products ("claim"), and you may
                    resolve your claim in any competent court in that Member
                    State that has jurisdiction over the claim. In all other
                    cases, you agree that the claim must be resolved in a
                    competent court in the United Kingdom law will govern these
                    Terms and any claim, without regard to conflict of law
                    provisions.
                  </li>
                  <br />
                  <li>
                    Other
                    <br />
                    <ol className="terms-privacy-list">
                      <li>
                        These Terms (formerly known as the Statement of Rights
                        and Responsibilities) make up the entire agreement
                        between you and Afrocamgist Limited regarding your use
                        of our Products. They supersede any prior agreements.
                      </li>
                      <li>
                        Some of the Products that we offer are also governed by
                        supplemental Terms. If you use any of these Products,
                        you will be provided with an opportunity to agree to
                        supplemental terms that will become part of our
                        agreement with you. For instance, if you access or use
                        our Products for commercial or business purposes, such
                        as buying ads, selling products, developing apps,
                        managing a group or Page for your business, or using our
                        measurement services, you must agree to our Commercial
                        Terms . If you post or share content containing music,
                        you must comply with our Music Guidelines . To the
                        extent that any supplemental Terms conflict with these
                        Terms, the supplemental Terms shall govern to the extent
                        of the conflict.
                      </li>
                      <li>
                        If any portion of these Terms is found to be
                        unenforceable, the remaining portion will remain in full
                        force and effect. If we fail to enforce any of these
                        Terms, it will not be considered a waiver. Any amendment
                        to or waiver of these Terms must be made in writing and
                        signed by us.
                      </li>
                      <li>
                        You will not transfer any of your rights or obligations
                        under these Terms to anyone else without our consent.
                      </li>
                      <li>
                        You may designate a person (called a legacy contact) to
                        manage your account if it is memorialised. Only your
                        legacy contact or a person who you have identified in a
                        valid will or similar document expressing clear consent
                        to disclose your content upon death or incapacity will
                        be able to seek disclosure from your account after it is
                        memorialised.
                      </li>
                      <li>
                        These Terms do not confer any third-party beneficiary
                        rights. All of our rights and obligations under these
                        Terms are freely assignable by us in connection with a
                        merger, acquisition or sale of assets, or by operation
                        of law or otherwise.
                      </li>
                      <li>
                        You should know that we may need to change the username
                        for your account in certain circumstances (for example,
                        if someone else claims the username and it appears
                        unrelated to the name that you use in everyday life). We
                        will inform you in advance if we have to do this and
                        explain why.
                      </li>
                      <li>
                        We always appreciate your feedback and other suggestions
                        about our products and services. But you should know
                        that we may use them without any restriction or
                        obligation to compensate you, and we are under no
                        obligation to keep them confidential.
                      </li>
                    </ol>
                  </li>
                </ol>
              </h6>
              <br />
              <h4 id="terms-5">
                <b>5. Other Terms and Policies that may apply to you</b>
              </h4>
              <h6>
                <ul className="terms-privacy-list">
                  <br />
                  <li>
                    <h5>
                      <b>Community Standards: </b>
                    </h5>
                    <ul className="terms-privacy-list">
                      <li>
                        We operate 2 system of accounts “public” and “private”,
                        public accounts sees post of users of both those they
                        following and those with same live interest as them.
                        However, to have more control of people that follow you
                        and see your post, Afrocamgist suggest the user chooses
                        the private account system on the setting page.
                      </li>
                      <li>
                        Users with Public account see all post of users with
                        similar interest and those they’re following.
                      </li>
                      <li>
                        However, Afrocamgist operate a popular post streams that
                        shows all best performing post irrespective of the
                        account system, but this posts changes as activities in
                        the platform changes.{" "}
                      </li>
                      <li>
                        All users must respect and regard each other diversity
                        and cultures. Except someone comment or post contravene
                        human rights, and right of existence and choices.
                        Therefore, we suggest that if an individual post offends
                        your believe or ideas but you’re are either a public or
                        private account holder we suggest you hide their post or
                        report them and if necessary block them entirely via
                        their profile page.{" "}
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <h5>
                      <b>Commercial Terms: </b>
                    </h5>
                    <ul className="terms-privacy-list">
                      <li>
                        Afrocamgist controls 100% of the adverts that shows on
                        the platform. However, based on the mission of
                        Afrocamgist, time to time Afrocamgist shall be hosting
                        competitive challenge in honour to reward the best
                        appreciated talent as a user’s post but all winners must
                        comply to Afrocamgist term and condition of the
                        challenge.{" "}
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <h5>
                      <b>Advertising Policies:</b>
                    </h5>
                    <ul className="terms-privacy-list">
                      <li>
                        All advertiser agrees that Afrocamgist shall not be
                        responsible to the performance of their advert but shall
                        provider ad service that is paid for.
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <h5>
                      <b>Challenge Promotion Policies:</b>
                    </h5>
                    <ul className="terms-privacy-list">
                      <li>
                        Every challenge promotion created by Afrocamgist, We
                        oblige to honour it to the winner, however, Afrocamgist
                        reserve the right to a null the winner if it’s
                        discovered that the winner do not comply to the setup
                        rules for the competition, such as, Original name of the
                        participant not same with account holder, Bank account
                        of the winner not same with the account holder in
                        Afrocamgist, or pirated a product, services or property
                        which won the award.
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <h5>
                      <b>Data policy:</b>
                    </h5>

                    <ul className="terms-privacy-list">
                      <li>
                        We share information globally, within the Afrocamgist
                        Company, However, all data handling and process complies
                        with Afrocamgist terms, We utilise standard contractual
                        clauses approved by the European Commission and rely on
                        the European Commission's (EULA and Data protection Act
                        2019) adequacy decisions about certain countries, as
                        applicable, for data transfers from the EEA to the
                        United States and other countries.
                      </li>
                    </ul>
                  </li>
                </ul>
              </h6>
            </div>
          </div>
        </section>
        <DetailSection />
        <Footer idName="homefooter" />
      </div>
    );
  }
}

export default Home;
